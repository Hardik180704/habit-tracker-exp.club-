import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          { NOT: { id: req.userId } } // Exclude self
        ]
      },
      select: {
        id: true,
        username: true,
        // Check if currently following
        followers: {
          where: { followerId: req.userId },
          select: { id: true }
        }
      },
      take: 10
    });
    
    // Format response to include isFollowing boolean
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      isFollowing: user.followers.length > 0
    }));
    
    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followingId = parseInt(id);
    
    if (followingId === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId }
    });
    
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId
        }
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    
    await prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId
      }
    });
    
    res.json({ message: `You are now following ${userToFollow.username}` });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followingId = parseInt(id);
    
    const follow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId
        }
      }
    });
    
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    // Record to delete does not exist
    if (error.code === 'P2025') {
        return res.status(400).json({ error: 'Not following this user' });
    }
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

export const getFeed = async (req, res) => {
  try {
    // Get list of users I follow
    const following = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    
    // Include my own ID to see my own activity too? (Optional, usually feed includes self)
    followingIds.push(req.userId);
    
    const feed = await prisma.completion.findMany({
      where: {
        userId: { in: followingIds }
      },
      include: {
        user: {
          select: { username: true }
        },
        habit: {
          select: { name: true, category: true, icon: true, color: true }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 20
    });
    
    res.json({ feed });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: req.userId },
      include: {
        follower: {
          select: { id: true, username: true }
        }
      }
    });
    
    // Check if I follow them back
    const myFollowing = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true }
    });
    const myFollowingSet = new Set(myFollowing.map(f => f.followingId));

    const formatted = followers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      isFollowing: myFollowingSet.has(f.follower.id)
    }));
    
    res.json({ users: formatted });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.userId },
      include: {
        following: {
          select: { id: true, username: true }
        }
      }
    });

    const formatted = following.map(f => ({
      id: f.following.id,
      username: f.following.username,
      isFollowing: true
    }));
    
    res.json({ users: formatted });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

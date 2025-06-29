// controllers/viewController.js
const prisma = require('../models/client')

exports.trackView = async (req, res) => {
  try {
    const { slug } = req.params
    const { deviceId } = req.body
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const userAgent = req.headers['user-agent']

    if (!deviceId) {
      return res.status(400).json({ message: 'Missing device ID' })
    }

    await prisma.viewLog.create({
      data: {
        projectSlug: slug,
        deviceId,
        ip: typeof ip === 'string' ? ip : undefined,
        userAgent,
      },
    })

    res.status(201).json({ message: 'View logged' })
  } catch (err) {
    console.error('❌ View log error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getAnalytics = async (req, res) => {
  try {
    const viewsByProject = await prisma.viewLog.groupBy({
      by: ['projectSlug'],
      _count: true,
      orderBy: {
        _count: { projectSlug: 'desc' }
      }
    })

    const recentViews = await prisma.viewLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    res.json({ viewsByProject, recentViews })
  } catch (err) {
    console.error('❌ Analytics error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}


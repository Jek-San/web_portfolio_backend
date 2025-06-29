// controllers/projectController.js
const prisma = require('../models/client');

exports.getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
};

exports.getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      content,
      link,
      repo,
      tags,
    } = req.body;

    const coverFile = req.files?.cover?.[0];
    const galleryFiles = req.files?.gallery || [];

    if (!coverFile) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const imageUrl = `/uploads/${coverFile.filename}`;
    const images = galleryFiles.map((f) => `/uploads/${f.filename}`);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl,
        images,
        link,
        repo,
        tags: JSON.parse(tags),
      },
    });

    res.status(201).json(project);
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('slug')) {
      return res.status(409).json({ message: 'Slug already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const { slug } = req.params;

    const {
      title,
      description,
      content,
      link,
      repo,
      tags,
    } = req.body;

    const coverFile = req.files?.cover?.[0];
    const galleryFiles = req.files?.gallery || [];

    const data = {
      title,
      description,
      content,
      link,
      repo,
      tags: JSON.parse(tags),
    };

    if (coverFile) {
      data.imageUrl = `/uploads/${coverFile.filename}`;
    }

    if (galleryFiles.length > 0) {
      data.images = galleryFiles.map((f) => `/uploads/${f.filename}`);
    }

    const updated = await prisma.project.update({
      where: { slug },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id: Number(id) } });
  res.json({ message: 'Deleted' });
};

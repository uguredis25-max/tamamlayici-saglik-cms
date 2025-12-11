const mongoose = require('mongoose');

// Media Schema for managing images and other media files
const MediaSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a title for the media'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    altText: {
      type: String,
      trim: true,
      maxlength: [200, 'Alt text cannot exceed 200 characters'],
      default: ''
    },

    // File Information
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileSize: {
      type: Number,
      required: true,
      min: [0, 'File size cannot be negative']
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'audio/wav',
        'application/pdf'
      ]
    },
    fileExtension: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    // Storage & URLs
    url: {
      type: String,
      required: true,
      trim: true
    },
    uploadPath: {
      type: String,
      required: true,
      trim: true
    },
    storageService: {
      type: String,
      enum: ['local', 's3', 'cloudinary', 'azure'],
      default: 'local'
    },

    // Image-Specific Properties
    imageMetadata: {
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      format: {
        type: String,
        default: null
      },
      colorSpace: {
        type: String,
        default: null
      },
      hasAlpha: {
        type: Boolean,
        default: false
      },
      orientation: {
        type: Number,
        default: 1
      }
    },

    // Thumbnails & Variants
    thumbnails: [
      {
        size: {
          type: String,
          enum: ['small', 'medium', 'large', 'xlarge'],
          required: true
        },
        url: {
          type: String,
          required: true
        },
        width: Number,
        height: Number,
        fileSize: Number
      }
    ],

    // Media Classification
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'document', 'other'],
      required: true
    },
    category: {
      type: String,
      enum: ['profile', 'content', 'gallery', 'hero', 'icon', 'banner', 'other'],
      default: 'other'
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],

    // Relationships
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relatedContent: [
      {
        contentType: {
          type: String,
          enum: ['article', 'page', 'product', 'blog', 'other']
        },
        contentId: mongoose.Schema.Types.ObjectId,
        _id: false
      }
    ],

    // Status & Visibility
    isActive: {
      type: Boolean,
      default: true
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending'
    },

    // SEO & Metadata
    seo: {
      keywords: [String],
      canonicalUrl: String,
      noIndex: {
        type: Boolean,
        default: false
      }
    },

    // License & Copyright
    license: {
      type: String,
      enum: ['public-domain', 'cc-by', 'cc-by-sa', 'proprietary', 'other'],
      default: 'proprietary'
    },
    copyright: {
      holder: String,
      year: Number
    },

    // Analytics
    analytics: {
      views: {
        type: Number,
        default: 0,
        min: 0
      },
      downloads: {
        type: Number,
        default: 0,
        min: 0
      },
      shares: {
        type: Number,
        default: 0,
        min: 0
      }
    },

    // Audit Trail
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'media'
  }
);

// Indexes for better query performance
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ mediaType: 1 });
MediaSchema.index({ category: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ isActive: 1, isPublic: 1 });
MediaSchema.index({ status: 1 });
MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ 'relatedContent.contentId': 1 });

// Virtual for media type icon
MediaSchema.virtual('icon').get(function () {
  const icons = {
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    document: '📄',
    other: '📦'
  };
  return icons[this.mediaType] || '📦';
});

// Virtual for human-readable file size
MediaSchema.virtual('readableFileSize').get(function () {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Pre-save middleware - validate and normalize
MediaSchema.pre('save', function (next) {
  // Ensure tags are lowercase and unique
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }

  // Validate image dimensions if media type is image
  if (this.mediaType === 'image' && this.imageMetadata) {
    if (this.imageMetadata.width && this.imageMetadata.width <= 0) {
      return next(new Error('Image width must be greater than 0'));
    }
    if (this.imageMetadata.height && this.imageMetadata.height <= 0) {
      return next(new Error('Image height must be greater than 0'));
    }
  }

  next();
});

// Method to increment view count
MediaSchema.methods.incrementViews = function () {
  this.analytics.views += 1;
  return this.save();
};

// Method to increment download count
MediaSchema.methods.incrementDownloads = function () {
  this.analytics.downloads += 1;
  return this.save();
};

// Method to increment share count
MediaSchema.methods.incrementShares = function () {
  this.analytics.shares += 1;
  return this.save();
};

// Method to soft delete media
MediaSchema.methods.softDelete = function (userId) {
  this.isActive = false;
  this.deletedBy = userId;
  this.deletedAt = new Date();
  return this.save();
};

// Method to restore soft-deleted media
MediaSchema.methods.restore = function () {
  this.isActive = true;
  this.deletedBy = null;
  this.deletedAt = null;
  return this.save();
};

// Static method to get media by category
MediaSchema.statics.getByCategory = function (category, filter = {}) {
  return this.find({
    category,
    isActive: true,
    ...filter
  }).sort({ createdAt: -1 });
};

// Static method to get public media
MediaSchema.statics.getPublicMedia = function (filter = {}) {
  return this.find({
    isPublic: true,
    isActive: true,
    status: 'approved',
    ...filter
  }).sort({ createdAt: -1 });
};

// Static method to search media
MediaSchema.statics.searchMedia = function (query, filter = {}) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ],
    isActive: true,
    ...filter
  }).sort({ createdAt: -1 });
};

// Ensure virtuals are included when converting to JSON
MediaSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove sensitive fields if needed
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Media', MediaSchema);

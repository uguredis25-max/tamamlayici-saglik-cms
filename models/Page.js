const mongoose = require('mongoose');

/**
 * Page Schema - Comprehensive page management for CMS
 * Includes content management, SEO, analytics, visibility, and advanced features
 */
const PageSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a page title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      index: true,
    },

    slug: {
      type: String,
      required: [true, 'Please provide a page slug'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [300, 'Slug cannot be more than 300 characters'],
      index: true,
      validate: {
        validator: function (v) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
        },
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      },
    },

    // Content Management
    content: {
      type: String,
      required: [true, 'Please provide page content'],
      default: '',
    },

    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
      default: '',
    },

    // Author Information
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an author'],
    },

    // Page Status
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    scheduledFor: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v > new Date();
        },
        message: 'Scheduled date must be in the future',
      },
    },

    // Page Type
    pageType: {
      type: String,
      enum: [
        'standard',
        'landing',
        'service',
        'product',
        'blog',
        'contact',
        'testimonial',
        'faq',
        'custom',
      ],
      default: 'standard',
      index: true,
    },

    // Page Sections
    sections: [
      {
        id: {
          type: String,
          required: true,
          unique: true,
        },
        type: {
          type: String,
          enum: [
            'hero',
            'content',
            'features',
            'cta',
            'testimonial',
            'gallery',
            'form',
            'pricing',
            'team',
            'faq',
            'newsletter',
            'custom',
          ],
          required: true,
        },
        title: String,
        content: String,
        data: mongoose.Schema.Types.Mixed,
        order: {
          type: Number,
          default: 0,
        },
        isVisible: {
          type: Boolean,
          default: true,
        },
        styling: {
          backgroundColor: String,
          textColor: String,
          customCSS: String,
        },
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],

    // SEO Settings
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, 'Meta title cannot be more than 60 characters'],
        default: '',
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot be more than 160 characters'],
        default: '',
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
      metaImage: String,
      canonicalUrl: String,
      ogTitle: String,
      ogDescription: String,
      ogImage: String,
      ogType: {
        type: String,
        default: 'website',
      },
      robotsIndex: {
        type: Boolean,
        default: true,
      },
      robotsFollow: {
        type: Boolean,
        default: true,
      },
      structuredData: mongoose.Schema.Types.Mixed,
    },

    // Template
    template: {
      type: String,
      enum: [
        'default',
        'blank',
        'sidebar',
        'fullwidth',
        'landing',
        'portfolio',
        'documentation',
        'custom',
      ],
      default: 'default',
    },

    templateSettings: {
      headerVisible: {
        type: Boolean,
        default: true,
      },
      footerVisible: {
        type: Boolean,
        default: true,
      },
      sidebarVisible: {
        type: Boolean,
        default: false,
      },
      customHeaderHTML: String,
      customFooterHTML: String,
      customCSS: String,
      customJS: String,
    },

    // Visibility & Access Control
    visibility: {
      isPublic: {
        type: Boolean,
        default: true,
      },
      passwordProtected: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        default: null,
      },
      roles: {
        type: [String],
        enum: ['admin', 'editor', 'author', 'subscriber', 'guest'],
        default: ['admin', 'editor'],
      },
      restrictedUsers: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User',
        default: [],
      },
      geoRestrictions: {
        enabled: {
          type: Boolean,
          default: false,
        },
        allowedCountries: [String],
        blockedCountries: [String],
      },
    },

    // Analytics & Tracking
    analytics: {
      pageViews: {
        type: Number,
        default: 0,
      },
      uniqueVisitors: {
        type: Number,
        default: 0,
      },
      bounceRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      averageTimeOnPage: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      conversionCount: {
        type: Number,
        default: 0,
      },
      trackingCode: String,
      gaPageId: String,
      lastAnalyticsUpdate: Date,
    },

    // Advanced Features
    advancedFeatures: {
      enableComments: {
        type: Boolean,
        default: false,
      },
      commentModeration: {
        type: Boolean,
        default: true,
      },
      enableRating: {
        type: Boolean,
        default: false,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
      enableSocialSharing: {
        type: Boolean,
        default: true,
      },
      relatedPages: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Page',
        default: [],
      },
      tags: {
        type: [String],
        default: [],
        index: true,
      },
      categories: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Category',
        default: [],
      },
      enableVersioning: {
        type: Boolean,
        default: true,
      },
      versionHistory: [
        {
          versionNumber: Number,
          title: String,
          content: String,
          author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          changes: String,
        },
      ],
      currentVersion: {
        type: Number,
        default: 1,
      },
    },

    // Media & Attachments
    media: {
      featuredImage: String,
      gallery: [String],
      attachments: [
        {
          filename: String,
          url: String,
          type: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // Performance & Caching
    performance: {
      enableCache: {
        type: Boolean,
        default: true,
      },
      cacheDuration: {
        type: Number,
        default: 3600,
        min: 0,
      },
      lazyLoadImages: {
        type: Boolean,
        default: true,
      },
      minifyCSS: {
        type: Boolean,
        default: true,
      },
      minifyJS: {
        type: Boolean,
        default: true,
      },
      compressionEnabled: {
        type: Boolean,
        default: true,
      },
    },

    // Workflow & Publishing
    workflow: {
      submittedAt: Date,
      submittedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
      approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      reviewNotes: String,
      requiresApproval: {
        type: Boolean,
        default: true,
      },
    },

    // Metadata
    metadata: {
      pageColor: String,
      icon: String,
      banner: String,
      displayOrder: {
        type: Number,
        default: 0,
      },
      isHomePage: {
        type: Boolean,
        default: false,
      },
      isSiteMap: {
        type: Boolean,
        default: false,
      },
      customMetadata: mongoose.Schema.Types.Mixed,
    },

    // Parent/Child Relationships (for hierarchical pages)
    parentPage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Page',
      default: null,
    },

    childPages: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Page',
      default: [],
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    lastModifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1, publishedAt: -1 });
PageSchema.index({ author: 1, createdAt: -1 });
PageSchema.index({ pageType: 1 });
PageSchema.index({ 'tags': 1 });
PageSchema.index({ 'seo.metaKeywords': 1 });
PageSchema.index({ parentPage: 1 });

// Virtual for page URL
PageSchema.virtual('url').get(function () {
  return `/pages/${this.slug}`;
});

// Virtual for read time (estimates based on content)
PageSchema.virtual('readTime').get(function () {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Virtual for is published
PageSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && this.publishedAt <= new Date();
});

// Pre-save middleware
PageSchema.pre('save', function (next) {
  // Update the updatedAt timestamp
  this.updatedAt = new Date();

  // Update publishedAt based on status
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Auto-generate meta title if not provided
  if (!this.seo.metaTitle && this.title) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }

  // Auto-generate meta description from excerpt if not provided
  if (!this.seo.metaDescription && this.excerpt) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }

  next();
});

// Post-save middleware for version history
PageSchema.post('save', function (doc, next) {
  if (this.advancedFeatures.enableVersioning && this.isModified('content')) {
    if (!doc.advancedFeatures.versionHistory) {
      doc.advancedFeatures.versionHistory = [];
    }

    doc.advancedFeatures.versionHistory.push({
      versionNumber: doc.advancedFeatures.currentVersion,
      title: doc.title,
      content: doc.content,
      author: doc.lastModifiedBy || doc.author,
      createdAt: new Date(),
    });

    doc.advancedFeatures.currentVersion += 1;
  }
  next();
});

// Instance methods
PageSchema.methods.publish = function () {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

PageSchema.methods.archive = function () {
  this.status = 'archived';
  return this.save();
};

PageSchema.methods.revert = function (versionNumber) {
  const version = this.advancedFeatures.versionHistory.find(
    (v) => v.versionNumber === versionNumber
  );

  if (!version) {
    throw new Error('Version not found');
  }

  this.content = version.content;
  this.title = version.title;
  return this.save();
};

PageSchema.methods.updateAnalytics = function (data) {
  Object.assign(this.analytics, data);
  this.analytics.lastAnalyticsUpdate = new Date();
  return this.save();
};

PageSchema.methods.addRelatedPage = function (pageId) {
  if (!this.advancedFeatures.relatedPages.includes(pageId)) {
    this.advancedFeatures.relatedPages.push(pageId);
  }
  return this.save();
};

PageSchema.methods.toggleComments = function (enabled) {
  this.advancedFeatures.enableComments = enabled;
  return this.save();
};

// Static methods
PageSchema.statics.findPublished = function () {
  return this.find({
    status: 'published',
    publishedAt: { $lte: new Date() },
  });
};

PageSchema.statics.findByPageType = function (type) {
  return this.find({ pageType: type });
};

PageSchema.statics.findByTag = function (tag) {
  return this.find({ 'advancedFeatures.tags': tag });
};

PageSchema.statics.findHomePage = function () {
  return this.findOne({ 'metadata.isHomePage': true });
};

PageSchema.statics.incrementPageView = function (pageId) {
  return this.findByIdAndUpdate(
    pageId,
    { $inc: { 'analytics.pageViews': 1 } },
    { new: true }
  );
};

module.exports = mongoose.model('Page', PageSchema);

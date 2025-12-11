const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
  {
    // Page Identification
    pageTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      description: 'Page title (displayed in browser tab and search results)'
    },
    pageSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      description: 'URL-friendly slug for the page'
    },
    pageType: {
      type: String,
      enum: ['homepage', 'service', 'blog', 'product', 'custom', 'other'],
      default: 'custom',
      description: 'Type of page for SEO categorization'
    },

    // Meta Information
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      description: 'Meta description (displayed in search results)'
    },
    metaKeywords: {
      type: [String],
      default: [],
      description: 'Array of meta keywords'
    },
    metaAuthor: {
      type: String,
      trim: true,
      description: 'Author of the page content'
    },

    // Open Graph (Social Media)
    ogTitle: {
      type: String,
      trim: true,
      maxlength: 255,
      description: 'Open Graph title for social sharing'
    },
    ogDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      description: 'Open Graph description for social sharing'
    },
    ogImage: {
      type: String,
      trim: true,
      description: 'Open Graph image URL for social sharing'
    },
    ogType: {
      type: String,
      enum: ['website', 'article', 'product', 'business.business', 'other'],
      default: 'website',
      description: 'Open Graph content type'
    },

    // Twitter Card
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image',
      description: 'Twitter card type'
    },
    twitterTitle: {
      type: String,
      trim: true,
      maxlength: 255,
      description: 'Twitter card title'
    },
    twitterDescription: {
      type: String,
      trim: true,
      maxlength: 200,
      description: 'Twitter card description'
    },
    twitterImage: {
      type: String,
      trim: true,
      description: 'Twitter card image URL'
    },

    // Structured Data / Schema.org
    schemaMarkup: {
      type: mongoose.Schema.Types.Mixed,
      description: 'JSON-LD structured data (Schema.org markup)'
    },

    // Canonical URL
    canonicalUrl: {
      type: String,
      trim: true,
      description: 'Canonical URL to prevent duplicate content issues'
    },

    // Robots Meta
    robotsMeta: {
      type: String,
      enum: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'],
      default: 'index, follow',
      description: 'Robots meta tag directive'
    },

    // Alternate Language Links
    alternateLanguages: {
      type: [
        {
          language: String,
          url: String
        }
      ],
      default: [],
      description: 'Alternate language versions of the page'
    },

    // Sitemap Settings
    includeInSitemap: {
      type: Boolean,
      default: true,
      description: 'Include page in XML sitemap'
    },
    sitemapPriority: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.5,
      description: 'Sitemap priority (0.0 - 1.0)'
    },
    sitemapChangefreq: {
      type: String,
      enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      default: 'weekly',
      description: 'Sitemap change frequency'
    },

    // Additional SEO Settings
    focusKeyword: {
      type: String,
      trim: true,
      description: 'Primary keyword for SEO focus'
    },
    readableSlug: {
      type: String,
      trim: true,
      description: 'Human-readable URL slug'
    },
    breadcrumbs: {
      type: [
        {
          name: String,
          url: String
        }
      ],
      default: [],
      description: 'Breadcrumb navigation for schema markup'
    },

    // Page-specific Association
    associatedPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      description: 'Reference to the associated page document'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      description: 'Creation timestamp'
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'Last update timestamp'
    }
  },
  {
    timestamps: true,
    collection: 'seos'
  }
);

// Index for faster queries
seoSchema.index({ pageSlug: 1 });
seoSchema.index({ pageType: 1 });
seoSchema.index({ includeInSitemap: 1 });
seoSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp on save
seoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full canonical URL if not explicitly set
seoSchema.virtual('fullCanonicalUrl').get(function() {
  return this.canonicalUrl || `/${this.pageSlug}`;
});

module.exports = mongoose.model('SEO', seoSchema);

const mongoose = require('mongoose');

/**
 * Settings Schema - Comprehensive site configuration for Tamamlayıcı Sağlık CMS
 * Manages all site-wide settings including contact info, SEO, design, security, performance,
 * healthcare settings, and legal compliance options
 */

const SettingsSchema = new mongoose.Schema(
  {
    // ==================== CONTACT INFORMATION ====================
    contact: {
      email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        description: 'Primary contact email address'
      },
      phone: {
        type: String,
        required: true,
        description: 'Primary phone number'
      },
      emergencyPhone: {
        type: String,
        description: 'Emergency contact phone number'
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: {
          type: String,
          default: 'Turkey'
        }
      },
      workingHours: {
        monday: { opening: String, closing: String }, // e.g., "09:00", "18:00"
        tuesday: { opening: String, closing: String },
        wednesday: { opening: String, closing: String },
        thursday: { opening: String, closing: String },
        friday: { opening: String, closing: String },
        saturday: { opening: String, closing: String },
        sunday: { opening: String, closing: String }
      },
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String,
        whatsapp: String
      }
    },

    // ==================== SEO SETTINGS ====================
    seo: {
      siteTitle: {
        type: String,
        required: true,
        description: 'Default site title for SEO'
      },
      siteDescription: {
        type: String,
        required: true,
        maxlength: 160,
        description: 'Meta description for homepage'
      },
      siteKeywords: {
        type: [String],
        description: 'Primary keywords for the site'
      },
      googleAnalyticsId: {
        type: String,
        description: 'Google Analytics tracking ID (UA-XXXXXXXXX-X or G-XXXXXXXXXX)'
      },
      googleSearchConsoleId: {
        type: String,
        description: 'Google Search Console verification ID'
      },
      bingWebmasterId: {
        type: String,
        description: 'Bing Webmaster Tools ID'
      },
      facebookPixelId: {
        type: String,
        description: 'Facebook Pixel ID for tracking'
      },
      twitterHandle: {
        type: String,
        description: 'Twitter handle for social cards'
      },
      ogImage: {
        type: String,
        description: 'Open Graph image URL for social sharing'
      },
      sitemapUrl: {
        type: String,
        default: '/sitemap.xml',
        description: 'URL path for sitemap'
      },
      robotsTxt: {
        type: String,
        description: 'Custom robots.txt content'
      },
      enableXmlSitemap: {
        type: Boolean,
        default: true
      },
      canonicalUrl: {
        type: String,
        description: 'Canonical URL for the site'
      }
    },

    // ==================== DESIGN & UI SETTINGS ====================
    design: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light',
        description: 'Default theme mode'
      },
      primaryColor: {
        type: String,
        default: '#0066cc',
        description: 'Primary brand color (hex)'
      },
      secondaryColor: {
        type: String,
        default: '#00cc00',
        description: 'Secondary brand color (hex)'
      },
      accentColor: {
        type: String,
        default: '#ff6600',
        description: 'Accent color (hex)'
      },
      logo: {
        type: String,
        description: 'URL to logo image'
      },
      favicon: {
        type: String,
        description: 'URL to favicon'
      },
      fontFamily: {
        type: String,
        default: 'Inter, sans-serif',
        description: 'Primary font family'
      },
      headingFontFamily: {
        type: String,
        default: 'Poppins, sans-serif',
        description: 'Font family for headings'
      },
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      enableDarkMode: {
        type: Boolean,
        default: true
      },
      enableAnimations: {
        type: Boolean,
        default: true
      },
      animationDuration: {
        type: Number,
        default: 300,
        description: 'Animation duration in milliseconds'
      },
      responsiveBreakpoints: {
        mobile: { type: Number, default: 480 },
        tablet: { type: Number, default: 768 },
        desktop: { type: Number, default: 1024 },
        wide: { type: Number, default: 1440 }
      }
    },

    // ==================== SECURITY SETTINGS ====================
    security: {
      enableSSL: {
        type: Boolean,
        default: true,
        description: 'Force HTTPS/SSL'
      },
      enableTwoFactor: {
        type: Boolean,
        default: true,
        description: 'Require 2FA for admin accounts'
      },
      passwordMinLength: {
        type: Number,
        default: 8,
        min: 6,
        description: 'Minimum password length'
      },
      passwordRequireNumbers: {
        type: Boolean,
        default: true
      },
      passwordRequireSpecialChars: {
        type: Boolean,
        default: true
      },
      passwordRequireUppercase: {
        type: Boolean,
        default: true
      },
      sessionTimeout: {
        type: Number,
        default: 3600,
        description: 'Session timeout in seconds (1 hour)'
      },
      enableRateLimiting: {
        type: Boolean,
        default: true,
        description: 'Enable rate limiting for API endpoints'
      },
      maxLoginAttempts: {
        type: Number,
        default: 5,
        description: 'Maximum login attempts before account lockout'
      },
      lockoutDuration: {
        type: Number,
        default: 900,
        description: 'Account lockout duration in seconds (15 minutes)'
      },
      enableIPWhitelist: {
        type: Boolean,
        default: false
      },
      ipWhitelist: {
        type: [String],
        description: 'Whitelisted IP addresses'
      },
      enableCORS: {
        type: Boolean,
        default: true
      },
      allowedOrigins: {
        type: [String],
        description: 'Allowed CORS origins'
      },
      enableCSRFProtection: {
        type: Boolean,
        default: true
      },
      enableContentSecurityPolicy: {
        type: Boolean,
        default: true
      },
      requireEmailVerification: {
        type: Boolean,
        default: true,
        description: 'Require email verification for new accounts'
      },
      enableBackupAuth: {
        type: Boolean,
        default: true,
        description: 'Enable backup authentication codes'
      }
    },

    // ==================== PERFORMANCE SETTINGS ====================
    performance: {
      enableCaching: {
        type: Boolean,
        default: true
      },
      cacheDuration: {
        type: Number,
        default: 3600,
        description: 'Cache duration in seconds'
      },
      enableImageOptimization: {
        type: Boolean,
        default: true
      },
      imageQuality: {
        type: Number,
        default: 80,
        min: 1,
        max: 100,
        description: 'Image compression quality percentage'
      },
      enableGzip: {
        type: Boolean,
        default: true,
        description: 'Enable gzip compression'
      },
      enableMinification: {
        type: Boolean,
        default: true,
        description: 'Enable CSS/JS minification'
      },
      cdnUrl: {
        type: String,
        description: 'CDN URL for static assets'
      },
      maxFileUploadSize: {
        type: Number,
        default: 52428800,
        description: 'Maximum file upload size in bytes (50MB default)'
      },
      enableLazyLoading: {
        type: Boolean,
        default: true
      },
      enablePrefetching: {
        type: Boolean,
        default: true
      },
      databasePoolSize: {
        type: Number,
        default: 10,
        description: 'Database connection pool size'
      },
      apiRateLimit: {
        type: Number,
        default: 100,
        description: 'API requests per minute'
      }
    },

    // ==================== HEALTHCARE SETTINGS ====================
    healthcare: {
      facilityName: {
        type: String,
        required: true,
        description: 'Name of the healthcare facility'
      },
      facilityType: {
        type: String,
        enum: ['clinic', 'hospital', 'wellness_center', 'therapy_center', 'laboratory', 'pharmacy', 'other'],
        description: 'Type of healthcare facility'
      },
      licenseNumber: {
        type: String,
        description: 'Healthcare facility license number'
      },
      taxId: {
        type: String,
        description: 'Tax identification number'
      },
      enableAppointmentSystem: {
        type: Boolean,
        default: true,
        description: 'Enable online appointment booking'
      },
      appointmentBuffer: {
        type: Number,
        default: 15,
        description: 'Buffer time between appointments in minutes'
      },
      maxConcurrentAppointments: {
        type: Number,
        default: 10,
        description: 'Maximum concurrent appointments'
      },
      enablePatientPortal: {
        type: Boolean,
        default: true,
        description: 'Enable patient portal access'
      },
      enableTelemedicine: {
        type: Boolean,
        default: false,
        description: 'Enable telemedicine consultations'
      },
      enablePrescriptionManagement: {
        type: Boolean,
        default: false,
        description: 'Enable prescription tracking'
      },
      enableMedicalRecords: {
        type: Boolean,
        default: false,
        description: 'Enable digital medical records'
      },
      enableBillingSystem: {
        type: Boolean,
        default: true
      },
      acceptedInsurance: {
        type: [String],
        description: 'List of accepted insurance providers'
      },
      departments: {
        type: [String],
        description: 'Available departments/specialties'
      },
      languages: {
        type: [String],
        default: ['Turkish', 'English'],
        description: 'Languages spoken at facility'
      },
      hipaaCompliant: {
        type: Boolean,
        default: true,
        description: 'HIPAA compliance status'
      },
      gdprCompliant: {
        type: Boolean,
        default: true,
        description: 'GDPR compliance status'
      }
    },

    // ==================== LEGAL COMPLIANCE SETTINGS ====================
    legal: {
      privacyPolicyUrl: {
        type: String,
        description: 'URL to privacy policy'
      },
      termsOfServiceUrl: {
        type: String,
        description: 'URL to terms of service'
      },
      cookiePolicyUrl: {
        type: String,
        description: 'URL to cookie policy'
      },
      disclaimerUrl: {
        type: String,
        description: 'URL to medical disclaimer'
      },
      enableCookieConsent: {
        type: Boolean,
        default: true,
        description: 'Show cookie consent banner'
      },
      enableAgeVerification: {
        type: Boolean,
        default: false,
        description: 'Require age verification'
      },
      minimumAge: {
        type: Number,
        default: 18,
        description: 'Minimum age requirement'
      },
      gdprEnabled: {
        type: Boolean,
        default: true,
        description: 'GDPR regulations enabled'
      },
      ccpaEnabled: {
        type: Boolean,
        default: false,
        description: 'CCPA regulations enabled'
      },
      dataRetentionDays: {
        type: Number,
        default: 2555,
        description: 'Data retention period in days (7 years default)'
      },
      enableUserDataExport: {
        type: Boolean,
        default: true,
        description: 'Allow users to export their data'
      },
      enableUserDataDeletion: {
        type: Boolean,
        default: true,
        description: 'Allow users to request data deletion'
      },
      enableAuditLogging: {
        type: Boolean,
        default: true,
        description: 'Log all user activities for compliance'
      },
      disclaimerText: {
        type: String,
        description: 'Medical disclaimer text to display'
      },
      complianceOfficerEmail: {
        type: String,
        description: 'Email for compliance inquiries'
      },
      dpoEmail: {
        type: String,
        description: 'Data Protection Officer email (GDPR)'
      }
    },

    // ==================== NOTIFICATIONS & EMAIL ====================
    notifications: {
      enableEmailNotifications: {
        type: Boolean,
        default: true
      },
      enableSMSNotifications: {
        type: Boolean,
        default: true
      },
      enablePushNotifications: {
        type: Boolean,
        default: true
      },
      emailFrom: {
        type: String,
        description: 'Email address to send from'
      },
      emailFromName: {
        type: String,
        description: 'Name to display in from field'
      },
      smtpProvider: {
        type: String,
        enum: ['smtp', 'sendgrid', 'mailgun', 'aws_ses', 'other'],
        default: 'smtp'
      },
      appointmentReminder: {
        type: Boolean,
        default: true,
        description: 'Send appointment reminders'
      },
      appointmentReminderHours: {
        type: Number,
        default: 24,
        description: 'Hours before appointment to send reminder'
      }
    },

    // ==================== MAINTENANCE & SYSTEM ====================
    maintenance: {
      maintenanceMode: {
        type: Boolean,
        default: false,
        description: 'Enable maintenance mode'
      },
      maintenanceMessage: {
        type: String,
        description: 'Message to display during maintenance'
      },
      autoBackupEnabled: {
        type: Boolean,
        default: true
      },
      backupFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
      },
      backupRetentionDays: {
        type: Number,
        default: 30,
        description: 'How long to keep backups'
      },
      logRetentionDays: {
        type: Number,
        default: 90,
        description: 'How long to keep system logs'
      }
    },

    // ==================== METADATA ====================
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      description: 'User who last updated these settings'
    },
    updateHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changes: { type: String, description: 'Summary of changes made' }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'settings'
  }
);

// Indexes for better query performance
SettingsSchema.index({ 'contact.email': 1 });
SettingsSchema.index({ 'healthcare.licenseNumber': 1 });

// Validation for healthcare-specific settings
SettingsSchema.pre('save', function (next) {
  // Ensure at least one contact method is provided
  if (!this.contact.email && !this.contact.phone) {
    return next(new Error('At least email or phone contact information must be provided'));
  }

  // Validate password requirements
  if (this.security.passwordMinLength < 6) {
    return next(new Error('Password minimum length must be at least 6 characters'));
  }

  // Validate image quality
  if (this.performance.imageQuality < 1 || this.performance.imageQuality > 100) {
    return next(new Error('Image quality must be between 1 and 100'));
  }

  next();
});

module.exports = mongoose.model('Settings', SettingsSchema);

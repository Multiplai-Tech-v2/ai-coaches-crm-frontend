# Product Requirements Document

## AI-Powered Relationship Intelligence CRM

**Document Version:** 1.2  
**Date:** January 21, 2026  
**Status:** Draft for Review

---

## Executive Summary

This document outlines the product requirements for a next-generation AI-powered Customer Relationship Management (CRM) system designed specifically for organizations with independent sales teams. The platform combines the intuitive design principles of HubSpot with advanced relationship intelligence capabilities, enabling account-based selling through organizational chart mapping, stakeholder relationship tracking, and intelligent communication management.

The core differentiator is the system's ability to understand and visualize the organizational structure of target accounts, map relationships between key decision-makers, and track multi-threaded communications across the entire buying committee—capabilities essential for complex B2B sales cycles.

This CRM is part of a broader product ecosystem that includes CommandRoom.ai and AiCoaches.com, enabling seamless organizational data sharing and integrated billing for the full range of AiCoaches service offerings.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Product Vision](#2-product-vision)
3. [User Personas](#3-user-personas)
4. [Sales Pipeline Terminology](#4-sales-pipeline-terminology)
5. [Core Feature Requirements](#5-core-feature-requirements)
6. [AI Capabilities](#6-ai-capabilities)
7. [Product Catalog and Service Offerings](#7-product-catalog-and-service-offerings)
8. [Proposal Creator](#8-proposal-creator)
9. [Data Integration Requirements](#9-data-integration-requirements)
10. [Independent Salesperson Considerations](#10-independent-salesperson-considerations)
11. [Licensing and Subscription Model](#11-licensing-and-subscription-model)
12. [Commission Structure](#12-commission-structure)
13. [GDPR Compliance and AI Data Consent](#13-gdpr-compliance-and-ai-data-consent)
14. [White-Label Architecture](#14-white-label-architecture)
15. [Technical Requirements](#15-technical-requirements)
16. [Success Metrics](#16-success-metrics)
17. [Implementation Phases](#17-implementation-phases)
18. [Appendices](#appendices)

---

## 1. Problem Statement

Traditional CRMs treat customer relationships as simple contact-to-opportunity mappings, failing to capture the complexity of modern B2B sales where multiple stakeholders influence purchasing decisions. Sales teams struggle with:

- **Organizational Blindness:** No visibility into reporting structures, influence networks, or decision-making hierarchies within target accounts
- **Communication Silos:** Inability to track and coordinate touchpoints across multiple stakeholders from the same account
- **Relationship Intelligence Gaps:** No systematic way to identify champions, blockers, or the true economic buyers
- **Territory Conflicts:** Independent salespeople lack transparent mechanisms for deal registration and territory protection
- **Data Fragmentation:** Contact data from sources like PitchBook remains disconnected from relationship intelligence
- **Proposal Inefficiency:** No streamlined way to create professional proposals that link directly to billing and fulfillment systems

---

## 2. Product Vision

**Vision Statement:** Build the most intelligent account-based CRM that empowers sales teams to navigate complex organizational buying committees with AI-powered relationship mapping, stakeholder communication tracking, and predictive deal intelligence—with seamless proposal-to-billing workflow.

**Design Philosophy:** Mirror HubSpot's intuitive, user-friendly interface while extending functionality to support sophisticated account-based selling motions. The system should feel familiar to HubSpot users while offering capabilities that go far beyond standard CRM functionality.

**Key Differentiators:**

- Dynamic organizational chart visualization for every account
- Multi-stakeholder relationship mapping and influence scoring
- AI-powered communication tracking across all touchpoints
- Transparent deal registration system for independent sales teams
- Native PitchBook integration via daily CSV imports for enriched contact intelligence
- Bidirectional sync with CommandRoom.ai for organizational chart data
- Integrated proposal creator with AiCoaches.com billing system
- White-label-ready architecture for future brand customization

---

## 3. User Personas

### 3.1 Primary Persona: Independent Sales Representative

**Profile:** Self-directed sales professional who pays an annual subscription fee to access this CRM and other organizational platforms. Works on commission and manages their own pipeline. May represent multiple non-competing products or focus exclusively on this organization's offerings.

**Goals:**

- Register and protect deals within their territory
- Understand organizational structures before outreach
- Track all communications with key stakeholders
- Identify the fastest path to decision-makers
- Maintain visibility into their pipeline and commission earnings (85% of deal value)
- Create professional proposals quickly using pre-configured products and pricing

**Pain Points:**

- Fear of deal poaching by other independent reps
- Time wasted pursuing contacts without authority
- Difficulty coordinating multi-threaded outreach
- Limited visibility into competitor positioning within accounts
- Manual proposal creation is time-consuming and error-prone

### 3.2 Secondary Persona: Sales Manager / Administrator (Head Office)

**Profile:** Responsible for overall sales performance, territory allocation, conflict resolution, and platform administration. Receives 10% of commission on closed deals plus manages the 5% advertising fund.

**Goals:**

- Allocate target accounts fairly across the sales team
- Monitor deal registration and resolve conflicts
- Gain visibility into team-wide pipeline health
- Identify coaching opportunities based on communication patterns
- Ensure compliance with engagement protocols
- Manage subscription renewals and salesperson onboarding/offboarding
- Maintain product catalog with accurate pricing and descriptions

**Pain Points:**

- Resolving territory disputes between independent reps
- Lack of visibility into actual sales activities
- Difficulty forecasting with independent rep pipelines
- Managing data retention when salespeople leave
- Keeping product offerings and pricing current across all salespeople

### 3.3 Tertiary Persona: Account Executive (Enterprise)

**Profile:** Full-time sales professional managing complex, multi-stakeholder deals.

**Goals:**

- Map all stakeholders in the buying committee
- Coordinate team selling across SDRs, SEs, and executives
- Track relationship health across all contacts
- Identify gaps in organizational coverage

---

## 4. Sales Pipeline Terminology

The following standardized terminology will be used throughout the CRM. This framework balances industry-standard language with clarity for users at all experience levels.

### 4.1 Pipeline Stages (Recommended)

| Stage           | Definition                                                                      | Entry Criteria                                                        | Exit Criteria                        |
| --------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------ |
| **Suspect**     | A company that fits the Ideal Customer Profile (ICP) but has not been contacted | Imported from PitchBook or manually added; matches ICP criteria       | Initial outreach completed           |
| **Lead**        | A contact who has been reached or has shown initial interest                    | Response received, meeting scheduled, or inbound inquiry              | Qualified conversation completed     |
| **Prospect**    | A qualified potential buyer with confirmed need, authority, budget, or timeline | Discovery call completed; at least one BANT element confirmed         | Opportunity created with deal value  |
| **Opportunity** | An active deal with defined scope, stakeholders, and timeline                   | Formal proposal requested or presented; multiple stakeholders engaged | Verbal agreement or formal rejection |
| **Customer**    | A company that has completed at least one purchase                              | Contract signed; payment received or terms accepted                   | N/A (ongoing relationship)           |

### 4.2 Alternative Terminology Options

For organizations preferring different language (particularly relevant for white-label deployments), the system should support configurable stage names:

**Option A (Engagement-Focused):**
Target → Engaged → Qualified → Negotiating → Won/Lost

**Option B (Buyer Journey):**
Awareness → Consideration → Evaluation → Decision → Onboarding

**Option C (Traditional):**
Cold → Warm → Hot → Committed → Closed

### 4.3 Deal States

| State            | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| **Open**         | Active pursuit; next action defined                         |
| **Won**          | Closed successfully; revenue booked                         |
| **Lost**         | Deal lost to competitor, no decision, or budget constraints |
| **On Hold**      | Temporarily paused; prospect requested delay                |
| **Disqualified** | Does not meet qualification criteria                        |

---

## 5. Core Feature Requirements

### 5.1 Account Management

#### 5.1.1 Company Profiles

- **FR-101:** The system shall maintain comprehensive company profiles including firmographic data, industry classification, employee count, revenue range, and technology stack
- **FR-102:** Company profiles shall support custom fields defined by administrators
- **FR-103:** Each company shall have a dedicated activity timeline showing all touchpoints across all contacts
- **FR-104:** The system shall support parent-child company hierarchies for enterprise accounts with multiple divisions

#### 5.1.2 Organizational Chart Visualization

- **FR-110:** The system shall display an interactive organizational chart for each account showing reporting relationships
- **FR-111:** Org charts shall be editable manually and enriched automatically via AI and CommandRoom.ai sync
- **FR-112:** Each node in the org chart shall link to the corresponding contact record
- **FR-113:** The system shall support multiple org chart views: by department, by influence level, by engagement status
- **FR-114:** Users shall be able to identify "unknown" positions in the org chart that need discovery
- **FR-115:** The system shall track org chart changes over time, alerting users to departures, promotions, or new hires
- **FR-116:** The system shall sync organizational chart data bidirectionally with CommandRoom.ai when available for an account

#### 5.1.3 Stakeholder Mapping

- **FR-120:** Each contact shall have a stakeholder role classification (Champion, Influencer, Decision Maker, Blocker, End User, Technical Evaluator, Economic Buyer)
- **FR-121:** The system shall support relationship strength scoring (1-10) between the salesperson and each contact
- **FR-122:** The system shall visualize relationship maps showing connections between stakeholders
- **FR-123:** Users shall be able to document political dynamics and internal alliances within accounts

### 5.2 Contact Management

#### 5.2.1 Contact Records

- **FR-201:** Contact records shall include standard fields: name, title, department, email, phone, LinkedIn URL, physical address
- **FR-202:** The system shall support multiple email addresses and phone numbers per contact
- **FR-203:** Contacts shall be linked to one or more company records (for consultants, board members, etc.)
- **FR-204:** Each contact shall have an engagement score calculated from communication frequency and recency

#### 5.2.2 Contact Enrichment

- **FR-210:** The system shall process daily PitchBook CSV exports to import and enrich contact data
- **FR-211:** Contacts shall be automatically matched to existing records to prevent duplicates
- **FR-212:** The system shall flag contacts with outdated information based on LinkedIn profile changes
- **FR-213:** Users shall be able to manually update any auto-enriched fields
- **FR-214:** The system shall track the data source and last update timestamp for each enriched field

### 5.3 Communication Tracking

#### 5.3.1 Email Integration

- **FR-301:** The system shall integrate with Gmail and Outlook to automatically log sent and received emails
- **FR-302:** Email logging shall be bi-directional with optional BCC logging
- **FR-303:** Users shall be able to exclude personal emails from logging via domain blocklists
- **FR-304:** The system shall parse email threads and associate them with the correct contacts and accounts
- **FR-305:** Email content analysis for AI features shall require explicit user consent per GDPR requirements (see Section 13)

#### 5.3.2 Meeting Tracking

- **FR-310:** The system shall integrate with Google Calendar and Outlook Calendar
- **FR-311:** Meetings shall be automatically logged with attendees linked to contact records
- **FR-312:** Users shall be able to log meeting notes directly within the CRM
- **FR-313:** The system shall support meeting outcome categorization (Discovery, Demo, Negotiation, Check-in, etc.)

#### 5.3.3 Call Logging

- **FR-320:** The system shall support manual call logging with duration, outcome, and notes
- **FR-321:** Integration with VoIP systems (RingCentral, Dialpad, Aircall) shall enable automatic call logging
- **FR-322:** Call recordings shall be linkable to call log entries where available

#### 5.3.4 Cross-Stakeholder Communication View

- **FR-330:** The system shall provide a unified timeline view showing all communications across all contacts at an account
- **FR-331:** Users shall be able to filter communications by contact, type, date range, or salesperson
- **FR-332:** The system shall highlight communication gaps—stakeholders who haven't been contacted recently
- **FR-333:** The system shall identify accounts with single-threaded engagement (only one contact engaged) as risks

### 5.4 Pipeline Management

#### 5.4.1 Opportunity/Deal Management

- **FR-401:** Users shall be able to create opportunities with fields: name, value, expected close date, stage, probability, and associated contacts
- **FR-402:** Each opportunity shall support multiple contact associations with defined roles
- **FR-403:** The system shall maintain a full audit history of opportunity field changes
- **FR-404:** Users shall be able to link multiple opportunities to a single account
- **FR-405:** The system shall support pipeline views: list, Kanban board, and forecast table
- **FR-406:** Opportunities shall link to associated proposals created via the Proposal Creator

### 5.5 Task and Activity Management

- **FR-501:** Users shall be able to create tasks associated with contacts, accounts, or opportunities
- **FR-502:** Tasks shall have due dates, priorities, and recurrence options
- **FR-503:** The system shall provide a unified task inbox showing all pending activities
- **FR-504:** Automated task creation shall be triggered by pipeline stage changes or time-based rules

---

## 6. AI Capabilities

### 6.1 Organizational Intelligence

#### 6.1.1 Automated Org Chart Building

- **AI-101:** The system shall analyze email signatures, LinkedIn data, CommandRoom.ai data, and communication patterns to suggest organizational relationships
- **AI-102:** AI shall identify likely reporting relationships based on title analysis and communication flows
- **AI-103:** The system shall flag org chart suggestions for human confirmation before updating
- **AI-104:** When CommandRoom.ai data is available, it shall take precedence as the authoritative source for org structure

#### 6.1.2 Stakeholder Role Prediction

- **AI-110:** The system shall predict stakeholder roles (Champion, Blocker, etc.) based on communication sentiment and engagement patterns
- **AI-111:** AI shall identify potential economic buyers based on title, seniority, and decision-making language in communications
- **AI-112:** The system shall alert users when stakeholder roles appear to shift

### 6.2 Communication Intelligence

#### 6.2.1 Email Analysis

- **AI-201:** The system shall analyze email sentiment to gauge relationship health (requires user consent)
- **AI-202:** AI shall extract key topics, commitments, and next steps from email content (requires user consent)
- **AI-203:** The system shall identify buying signals in communications (budget discussions, timeline mentions, competitor references)

#### 6.2.2 Communication Recommendations

- **AI-210:** AI shall suggest optimal outreach timing based on historical response patterns
- **AI-211:** The system shall recommend which stakeholders to engage based on deal stage and org coverage
- **AI-212:** AI shall draft suggested follow-up messages based on conversation history

### 6.3 Deal Intelligence

#### 6.3.1 Risk Analysis

- **AI-301:** The system shall identify at-risk deals based on communication patterns, stakeholder engagement, and timeline slippage
- **AI-302:** AI shall flag deals with single-threaded relationships as high risk
- **AI-303:** The system shall predict deal outcomes based on historical patterns

#### 6.3.2 Competitive Intelligence

- **AI-310:** The system shall analyze communications for competitor mentions
- **AI-311:** AI shall track win/loss patterns against specific competitors
- **AI-312:** The system shall suggest competitive positioning based on deal characteristics

### 6.4 Proposal Intelligence

- **AI-401:** AI shall suggest relevant products/services based on opportunity context, account industry, and historical win patterns
- **AI-402:** The system shall recommend optimal pricing based on deal size, account tier, and competitive situation
- **AI-403:** AI shall generate proposal cover letter drafts based on account context and selected products

---

## 7. Product Catalog and Service Offerings

### 7.1 Product Categories

The CRM shall support a comprehensive product catalog for all AiCoaches.com service offerings. Products are organized into five primary categories:

#### 7.1.1 Workshops

| Attribute            | Description                                         |
| -------------------- | --------------------------------------------------- |
| **Category**         | Training and Education                              |
| **Delivery Formats** | In-Person Full Day, Online (4 × 90-minute sessions) |
| **Audience Types**   | Public (open enrollment), Private (organizational)  |
| **Pricing Model**    | Per-participant (public), Flat fee (private)        |

**Workshop Product Attributes:**

- Workshop Title/Name
- Workshop Code/SKU
- Description (short and long form)
- Learning Objectives
- Target Audience
- Prerequisites
- Duration (hours)
- Maximum Participants
- Minimum Participants (for viability)
- Pricing: Public per-participant rate
- Pricing: Private flat fee (with participant cap)
- Pricing: Private per-participant overage rate
- Materials included
- Facilitator requirements
- Status (Active, Coming Soon, Archived)

#### 7.1.2 AI Consulting and Fractional Chief AI Officer (CAIO)

| Attribute            | Description                        |
| -------------------- | ---------------------------------- |
| **Category**         | Professional Services              |
| **Engagement Types** | Monthly Retainer, Project-Based    |
| **Pricing Model**    | Monthly fee, Tiered by hours/scope |

**Consulting Product Attributes:**

- Service Name
- Service Code/SKU
- Description
- Scope of Services
- Deliverables
- Hours Included per Month
- Overage Hourly Rate
- Minimum Engagement Term
- Pricing Tiers (e.g., 10hrs/month, 20hrs/month, 40hrs/month)
- Executive Access Level (CEO briefings, Board presentations, etc.)
- Status (Active, Coming Soon, Archived)

#### 7.1.3 Software

| Attribute            | Description                                         |
| -------------------- | --------------------------------------------------- |
| **Category**         | Technology Products                                 |
| **Licensing Models** | Subscription (monthly/annual), Per-seat, Enterprise |
| **Pricing Model**    | Recurring subscription                              |

**Software Product Attributes:**

- Product Name
- Product Code/SKU
- Description
- Feature Set
- Licensing Model
- Pricing: Per-seat monthly
- Pricing: Per-seat annual (with discount)
- Pricing: Enterprise tier thresholds
- Implementation Fee (if applicable)
- Support Level Included
- Minimum Seats
- Maximum Seats (if limited)
- Trial Period Availability
- Status (Active, Beta, Coming Soon, Archived)

#### 7.1.4 Certifications

| Attribute         | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| **Category**      | Credentialing                                                              |
| **Types**         | Individual Certification, Team Certification, Organizational Certification |
| **Pricing Model** | One-time fee, Annual renewal                                               |

**Certification Product Attributes:**

- Certification Name
- Certification Code/SKU
- Description
- Prerequisites (workshops, experience)
- Examination Format
- Validity Period
- Pricing: Initial Certification Fee
- Pricing: Annual Renewal Fee
- Pricing: Re-examination Fee
- Digital Badge Included
- Status (Active, Coming Soon, Archived)

#### 7.1.5 Embedded Teams

| Attribute            | Description                   |
| -------------------- | ----------------------------- |
| **Category**         | Staff Augmentation            |
| **Engagement Types** | Full-time dedicated resources |
| **Pricing Model**    | Monthly per-resource fee      |

**Embedded Teams Product Attributes:**

- Role/Position Title
- Role Code/SKU
- Description
- Skill Set / Expertise Areas
- Seniority Level (Junior, Mid, Senior, Lead, Principal)
- Minimum Engagement Term
- Pricing: Monthly Rate
- Pricing: Quarterly Rate (with discount)
- Pricing: Annual Rate (with discount)
- Onboarding Period
- Notice Period for Termination
- Management/Oversight Included
- Status (Active, Coming Soon, Archived)

### 7.2 Product Catalog Administration

#### 7.2.1 Admin Interface Requirements

- **CAT-101:** Administrators shall have access to a Product Catalog Management interface
- **CAT-102:** The interface shall support full CRUD operations (Create, Read, Update, Delete) for all product types
- **CAT-103:** Products shall be organized by category with filtering and search capabilities
- **CAT-104:** Bulk import/export of products shall be supported via CSV
- **CAT-105:** Product changes shall be versioned with full audit history

#### 7.2.2 Product Lifecycle Management

- **CAT-110:** Products shall have status flags: Draft, Active, Coming Soon, Archived
- **CAT-111:** Only Active products shall appear in the Proposal Creator for salespeople
- **CAT-112:** Archived products shall remain visible on historical proposals but not selectable for new proposals
- **CAT-113:** Coming Soon products may be shown to salespeople with an indicator but cannot be added to proposals

#### 7.2.3 Pricing Management

- **CAT-120:** Each product shall support multiple pricing tiers or options
- **CAT-121:** Pricing shall support effective dates for scheduled price changes
- **CAT-122:** Historical pricing shall be preserved for audit and reporting
- **CAT-123:** Currency shall be configurable (default: USD, with support for GBP, EUR, AUD)
- **CAT-124:** Discount rules may be defined at the product or category level

#### 7.2.4 Product Bundles

- **CAT-130:** Administrators shall be able to create product bundles combining multiple products
- **CAT-131:** Bundles shall have their own pricing (typically discounted vs. individual products)
- **CAT-132:** Bundle components shall be visible on proposals with individual line items

---

## 8. Proposal Creator

### 8.1 Overview

The Proposal Creator enables salespeople to generate professional proposals by selecting products from the catalog, customizing pricing within defined parameters, and sending proposals to prospects for review and acceptance. Accepted proposals trigger order creation in the AiCoaches.com billing system.

### 8.2 Proposal Creation Workflow

#### 8.2.1 Proposal Initiation

- **PROP-101:** Proposals shall be created from within an Opportunity record or directly from the Proposal menu
- **PROP-102:** New proposals shall auto-populate with Account and Contact information from the linked Opportunity
- **PROP-103:** Users shall be able to create proposals without an Opportunity (creates Opportunity automatically)
- **PROP-104:** Each proposal shall have a unique proposal number (format configurable, e.g., PROP-2026-00001)

#### 8.2.2 Product Selection

- **PROP-110:** The Proposal Creator shall display the active product catalog organized by category
- **PROP-111:** Users shall search and filter products by name, category, or keyword
- **PROP-112:** Users shall add products to the proposal with quantity and any required configuration options
- **PROP-113:** For Workshops: Users shall specify delivery format (in-person/online), date preferences, public/private, and expected participant count
- **PROP-114:** For Consulting/CAIO: Users shall select the tier and engagement term
- **PROP-115:** For Software: Users shall specify seat count and subscription term
- **PROP-116:** For Certifications: Users shall specify number of candidates
- **PROP-117:** For Embedded Teams: Users shall specify role(s), quantity, and engagement term

#### 8.2.3 Pricing and Discounts

- **PROP-120:** Line item pricing shall auto-populate from the product catalog
- **PROP-121:** Users shall be able to apply discounts within administrator-defined limits
- **PROP-122:** Discount types: Percentage discount, Fixed amount discount, Custom unit price
- **PROP-123:** Discounts exceeding user's authority shall require administrator approval (approval workflow)
- **PROP-124:** The system shall display list price, discount amount, and net price for each line item
- **PROP-125:** Proposal totals shall calculate automatically including subtotals by category
- **PROP-126:** Tax calculation shall be supported (configurable by jurisdiction)

#### 8.2.4 Proposal Content

- **PROP-130:** Each proposal shall include:
  - Cover page with company branding
  - Executive summary / cover letter (editable, AI-assisted drafting available)
  - Detailed line items with descriptions
  - Pricing summary
  - Terms and conditions
  - Validity period
  - Acceptance signature block
- **PROP-131:** Users shall be able to add custom sections or notes to proposals
- **PROP-132:** Product descriptions on proposals shall be editable (to customize for the specific opportunity)
- **PROP-133:** The system shall support multiple proposal templates (selectable by user or auto-selected by product mix)

### 8.3 Proposal Review and Approval

#### 8.3.1 Internal Review

- **PROP-201:** Proposals shall have status: Draft, Pending Approval, Approved, Sent, Viewed, Accepted, Declined, Expired
- **PROP-202:** Proposals requiring discount approval shall route to designated approvers
- **PROP-203:** Approvers shall receive notifications and be able to approve/reject with comments
- **PROP-204:** Approval history shall be maintained for audit

#### 8.3.2 Proposal Approval Workflow

- **PROP-210:** Administrator shall configure approval thresholds:
  - Discount percentage thresholds (e.g., >10% requires manager approval, >20% requires director approval)
  - Total deal value thresholds
  - Specific product approvals (e.g., Embedded Teams always require approval)
- **PROP-211:** Multi-level approval shall be supported for high-value or high-discount proposals
- **PROP-212:** Approval delegation shall be supported for approver absence

### 8.4 Proposal Delivery

#### 8.4.1 Sending Proposals

- **PROP-301:** Approved proposals shall be sent to contacts via email
- **PROP-302:** Email shall include a secure link to view the proposal online
- **PROP-303:** PDF attachment option shall be available
- **PROP-304:** Email template shall be customizable with merge fields
- **PROP-305:** Users shall be able to send to multiple contacts (e.g., Champion + Economic Buyer)

#### 8.4.2 Proposal Tracking

- **PROP-310:** The system shall track when proposals are viewed (opened)
- **PROP-311:** View tracking shall capture: timestamp, viewer email (if known), duration, pages viewed
- **PROP-312:** Users shall receive notifications when proposals are viewed
- **PROP-313:** Proposal analytics shall show engagement metrics

### 8.5 Proposal Acceptance

#### 8.5.1 Electronic Acceptance

- **PROP-401:** Prospects shall be able to accept proposals electronically via the secure link
- **PROP-402:** Acceptance shall require:
  - Checkbox confirming agreement to terms and conditions
  - Electronic signature (typed name or drawn signature)
  - Signer's title and email
  - Timestamp (captured automatically)
- **PROP-403:** Accepted proposals shall generate a countersigned PDF for both parties
- **PROP-404:** Acceptance confirmation email shall be sent to prospect and salesperson

#### 8.5.2 Alternative Acceptance Methods

- **PROP-410:** Users shall be able to manually mark proposals as accepted (for offline acceptance)
- **PROP-411:** Manual acceptance shall require upload of signed document or notation of acceptance method
- **PROP-412:** DocuSign/PandaDoc integration shall be available for formal contract execution (Phase 3)

### 8.6 AiCoaches.com Billing Integration

#### 8.6.1 Order Creation

- **PROP-501:** Upon proposal acceptance, the system shall automatically create an order in the AiCoaches.com billing system
- **PROP-502:** Order data transmitted shall include:
  - Customer information (company, billing contact, address)
  - Line items with product codes, quantities, and pricing
  - Payment terms
  - Salesperson ID (for commission tracking)
  - Proposal reference number
- **PROP-503:** The integration shall use AiCoaches.com's REST API with OAuth 2.0 authentication
- **PROP-504:** Order creation shall be synchronous with confirmation returned to CRM

#### 8.6.2 Billing System Sync

- **PROP-510:** The CRM shall receive order status updates from AiCoaches.com (Invoiced, Paid, Partially Paid, Overdue)
- **PROP-511:** Invoice numbers and payment status shall be visible on the Opportunity and Proposal records
- **PROP-512:** Failed order creation shall trigger alerts to the salesperson and administrator
- **PROP-513:** Manual order creation in AiCoaches.com shall be supported as fallback

#### 8.6.3 Revenue Recognition

- **PROP-520:** Opportunity value shall update to match accepted proposal value
- **PROP-521:** Commission calculation shall be based on the final invoiced amount from AiCoaches.com
- **PROP-522:** Multi-line proposals shall support split revenue recognition (by product delivery date)

### 8.7 Proposal Templates and Branding

#### 8.7.1 Template Management

- **PROP-601:** Administrators shall be able to create and manage proposal templates
- **PROP-602:** Templates shall define:
  - Cover page layout and content
  - Section order and visibility
  - Default terms and conditions
  - Footer content
  - Color scheme and fonts
- **PROP-603:** Templates may be assigned to specific product categories or user groups
- **PROP-604:** Users shall be able to select from available templates when creating proposals

#### 8.7.2 Branding Assets

- **PROP-610:** Proposal branding shall be configurable:
  - Company logo (header and cover page)
  - Brand colors (headers, accents, buttons)
  - Font selections
  - Cover page background image
- **PROP-611:** White-label deployments shall use tenant-specific branding (see Section 14)

### 8.8 Proposal Analytics and Reporting

#### 8.8.1 Proposal Metrics

- **PROP-701:** The system shall track and report:
  - Proposals created (by salesperson, period, product category)
  - Proposal conversion rate (sent → accepted)
  - Average proposal value
  - Average discount percentage
  - Time from sent to viewed
  - Time from sent to accepted/declined
  - Most proposed products
  - Win/loss by product category

#### 8.8.2 Pipeline Integration

- **PROP-710:** Proposal status shall be visible on Opportunity records
- **PROP-711:** Proposal activity shall appear in Account and Contact timelines
- **PROP-712:** Pipeline reports shall include proposal-linked opportunities

---

## 9. Data Integration Requirements

### 9.1 PitchBook Integration

#### 9.1.1 CSV Import Process

- **INT-101:** The system shall support automated daily import of company and contact data from PitchBook CSV exports
- **INT-102:** A scheduled job shall process CSV files from a designated SFTP location or cloud storage bucket daily
- **INT-103:** Imported data shall be mapped to standard CRM fields with administrator-configurable field mapping
- **INT-104:** The system shall track PitchBook as the data source for imported records with import timestamp
- **INT-105:** Import logs shall be maintained showing records created, updated, skipped, and errors

#### 9.1.2 Data Matching and Deduplication

- **INT-110:** The system shall match incoming PitchBook records to existing records using configurable matching rules (email, company name + title, LinkedIn URL)
- **INT-111:** Fuzzy matching shall be applied for company names to handle variations
- **INT-112:** Duplicate candidates shall be flagged for manual review when confidence is below threshold
- **INT-113:** The system shall maintain both PitchBook data and user-entered overrides, with clear provenance tracking

### 9.2 CommandRoom.ai Integration

#### 9.2.1 Organizational Data Sync

- **INT-201:** The system shall integrate with CommandRoom.ai via API to retrieve organizational chart data
- **INT-202:** When a target company has published their org chart on CommandRoom.ai, that data shall be automatically imported
- **INT-203:** Sync shall be bidirectional—org chart updates made in the CRM can be pushed to CommandRoom.ai (with appropriate permissions)
- **INT-204:** The system shall handle SSO between this CRM and CommandRoom.ai for seamless user experience
- **INT-205:** CommandRoom.ai data shall be treated as authoritative for org structure when available, with local overrides tracked separately

#### 9.2.2 Data Freshness

- **INT-210:** The system shall check CommandRoom.ai for org chart updates on a configurable schedule (default: daily)
- **INT-211:** Users shall be notified when significant org chart changes are detected (new executives, departures, restructuring)
- **INT-212:** Historical org chart snapshots shall be retained for comparison

### 9.3 AiCoaches.com Billing Integration

#### 9.3.1 API Integration

- **INT-301:** The system shall integrate with AiCoaches.com billing via REST API
- **INT-302:** Authentication shall use OAuth 2.0 with secure token management
- **INT-303:** API endpoints required:
  - Create Customer
  - Create Order
  - Get Order Status
  - Get Invoice Status
  - Get Payment Status
- **INT-304:** All API calls shall be logged for troubleshooting and audit

#### 9.3.2 Data Synchronization

- **INT-310:** Customer records shall sync from CRM to AiCoaches.com upon first order
- **INT-311:** Existing AiCoaches.com customers shall be matched to CRM accounts
- **INT-312:** Order and invoice data shall sync from AiCoaches.com to CRM for visibility
- **INT-313:** Webhook notifications from AiCoaches.com shall update CRM records in real-time

#### 9.3.3 Error Handling

- **INT-320:** Failed API calls shall retry with exponential backoff (3 attempts)
- **INT-321:** Persistent failures shall create support tickets and notify administrators
- **INT-322:** Manual reconciliation tools shall be available for resolving sync issues

### 9.4 Additional Integrations

| Integration              | Priority | Purpose                             |
| ------------------------ | -------- | ----------------------------------- |
| LinkedIn Sales Navigator | High     | Contact enrichment, InMail tracking |
| Gmail / Google Workspace | High     | Email and calendar sync             |
| Microsoft 365 / Outlook  | High     | Email and calendar sync             |
| CommandRoom.ai           | High     | Organizational chart data           |
| AiCoaches.com Billing    | High     | Order and invoice management        |
| Slack                    | Medium   | Notifications, activity logging     |
| ZoomInfo                 | Medium   | Alternative contact enrichment      |
| Salesforce (export)      | Medium   | Data migration from existing CRM    |
| Zapier / Make            | Medium   | Custom workflow automation          |
| DocuSign / PandaDoc      | Low      | Formal contract execution           |

---

## 10. Independent Salesperson Considerations

### 10.1 Deal Registration System

#### 10.1.1 Registration Workflow

- **IND-101:** Independent salespeople shall be able to register deals by specifying the target company, primary contact, and estimated deal value
- **IND-102:** Deal registration shall include an expiration period (configurable, default 90 days) after which protection lapses
- **IND-103:** The system shall immediately notify administrators of new registrations
- **IND-104:** Registration shall create a protected status preventing other reps from registering the same account/opportunity

#### 10.1.2 Conflict Resolution

- **IND-110:** When a registration conflict occurs, the system shall notify both parties and the administrator
- **IND-111:** The system shall display registration history showing who engaged the account first
- **IND-112:** Administrators shall have the authority to adjudicate disputes and reassign registrations
- **IND-113:** The system shall maintain an audit log of all registration decisions

#### 10.1.3 Territory Management

- **IND-120:** Administrators shall be able to allocate suspect/lead lists to specific salespeople
- **IND-121:** Territory assignments may be by geography, industry, company size, or named accounts
- **IND-122:** The system shall prevent salespeople from accessing contact details for accounts outside their territory
- **IND-123:** Territory changes shall be logged and communicated automatically

### 10.2 Privacy and Data Visibility

#### 10.2.1 Information Barriers

- **IND-201:** Salespeople shall only see full details for accounts in their territory or registered to them
- **IND-202:** Master contact lists shall show limited information (company name only) until assignment
- **IND-203:** Communication history shall be private to the salesperson unless the account is transferred or escalated

#### 10.2.2 Data Retention on Departure

- **IND-210:** When a salesperson's subscription ends or is terminated, all account data and communication history shall be retained by the organization
- **IND-211:** Departed salesperson accounts shall be deactivated but data preserved for reassignment
- **IND-212:** Administrators shall be able to reassign accounts and territories from departed salespeople to active team members
- **IND-213:** The system shall maintain an archive of the departed salesperson's activity for audit and continuity purposes

### 10.3 Accountability and Activity Requirements

- **IND-301:** Administrators shall be able to define minimum activity requirements (calls, emails, meetings) per period
- **IND-302:** The system shall track activity levels and flag underperforming territories
- **IND-303:** Inactive registrations (no activity for configurable period) may be automatically released

---

## 11. Licensing and Subscription Model

### 11.1 Subscription Structure

#### 11.1.1 Salesperson Subscriptions

- **LIC-101:** Independent salespeople shall pay an annual subscription fee to access the CRM platform
- **LIC-102:** The subscription shall include access to this CRM and other designated organizational platforms (bundled access)
- **LIC-103:** Subscription fees shall be collected and managed centrally by head office
- **LIC-104:** The system shall track subscription status, renewal dates, and payment history for each salesperson

#### 11.1.2 Subscription Management

- **LIC-110:** Administrators shall have a subscription management dashboard showing all active, pending, and expired subscriptions
- **LIC-111:** The system shall send automated renewal reminders 60, 30, and 7 days before subscription expiration
- **LIC-112:** Grace period of 14 days shall be provided after expiration before account deactivation
- **LIC-113:** Expired accounts shall be placed in read-only mode during grace period, then deactivated

#### 11.1.3 Onboarding and Offboarding

- **LIC-120:** New salesperson onboarding shall include account provisioning, territory assignment, and training access
- **LIC-121:** Offboarding workflow shall include data retention, territory reassignment, and account deactivation
- **LIC-122:** The system shall support bulk subscription management for annual renewals

### 11.2 License Allocation

- **LIC-201:** Licenses are provided centrally by head office to salespeople as part of their annual subscription
- **LIC-202:** Head office administrators shall have unlimited administrative access at no per-seat cost
- **LIC-203:** The system shall track license utilization and available capacity

---

## 12. Commission Structure

### 12.1 Commission Split Configuration

#### 12.1.1 Standard Commission Distribution

The system shall automatically calculate and track commission distribution for all won opportunities:

| Recipient                          | Percentage | Description                            |
| ---------------------------------- | ---------- | -------------------------------------- |
| **Salesperson**                    | 85%        | Primary commission to the deal owner   |
| **Head Office (Operations)**       | 10%        | Organizational overhead and support    |
| **Head Office (Advertising Fund)** | 5%         | Marketing and advertising contribution |

#### 12.1.2 Commission Calculation Requirements

- **COM-101:** The system shall automatically calculate commission splits when an opportunity is marked as Won
- **COM-102:** Commission shall be calculated on the final invoiced amount from AiCoaches.com billing system
- **COM-103:** The system shall support adjustments for discounts, credits, or clawbacks with full audit trail
- **COM-104:** Commission calculations shall be visible to the salesperson on their dashboard

### 12.2 Commission Tracking and Reporting

#### 12.2.1 Salesperson View

- **COM-201:** Salespeople shall see a commission dashboard showing: expected commission (pipeline), earned commission (won deals), and paid commission
- **COM-202:** Commission projections shall update in real-time as deals progress through the pipeline
- **COM-203:** Historical commission statements shall be accessible for any period

#### 12.2.2 Administrator View

- **COM-210:** Administrators shall have access to organization-wide commission reports
- **COM-211:** Reports shall show total commissions by salesperson, time period, product, and territory
- **COM-212:** The advertising fund balance shall be tracked and reported separately
- **COM-213:** Export functionality shall support integration with accounting/payroll systems

### 12.3 Commission Rules Engine

- **COM-301:** The system shall support configurable commission rules for future flexibility (different rates by product, deal size, or salesperson tier)
- **COM-302:** Commission rule changes shall only apply to deals closed after the effective date
- **COM-303:** All commission calculations shall maintain full audit history

---

## 13. GDPR Compliance and AI Data Consent

### 13.1 Legal Basis and Principles

#### 13.1.1 Data Processing Principles

- **GDPR-101:** The system shall process personal data in accordance with GDPR principles: lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and accountability
- **GDPR-102:** The legal basis for CRM data processing shall be legitimate interest for standard CRM functions and explicit consent for AI-enhanced features
- **GDPR-103:** The system shall maintain a Record of Processing Activities (ROPA) documenting all data processing

### 13.2 Consent Management for AI Features

#### 13.2.1 Consent Architecture

- **GDPR-201:** AI-powered email analysis features shall require explicit, informed consent from the user before activation
- **GDPR-202:** Consent shall be granular—users can enable/disable specific AI features independently:
  - Email sentiment analysis
  - Automated topic extraction
  - Buying signal detection
  - Communication recommendations
  - AI-drafted message suggestions
  - AI-assisted proposal generation
- **GDPR-203:** Consent status shall be clearly displayed in user settings with easy toggle controls
- **GDPR-204:** The system shall function fully without AI features for users who decline consent

#### 13.2.2 Consent Collection

- **GDPR-210:** During onboarding, users shall be presented with clear explanations of each AI feature, what data it processes, and how it benefits them
- **GDPR-211:** Consent language shall be plain, specific, and free from pre-checked boxes
- **GDPR-212:** Users shall be able to withdraw consent at any time with immediate effect
- **GDPR-213:** Consent records shall be timestamped and retained for audit purposes

### 13.3 Data Subject Rights

#### 13.3.1 Right of Access

- **GDPR-301:** Users shall be able to export all personal data held about them in machine-readable format (JSON, CSV)
- **GDPR-302:** Data export shall include all communications, notes, activities, and AI-generated insights
- **GDPR-303:** Export requests shall be fulfilled within 30 days

#### 13.3.2 Right to Erasure

- **GDPR-310:** Users shall be able to request deletion of their personal data
- **GDPR-311:** The system shall support selective deletion (specific records) and full account deletion
- **GDPR-312:** Deletion requests shall cascade to backups within 90 days
- **GDPR-313:** Where legal retention requirements apply, the system shall anonymize rather than delete

#### 13.3.3 Right to Rectification

- **GDPR-320:** Users shall be able to correct inaccurate personal data
- **GDPR-321:** Corrections shall propagate to all integrated systems where technically feasible

### 13.4 Third-Party Data Processing

#### 13.4.1 Contact Data Considerations

- **GDPR-401:** When processing contact data (prospects, leads), the legal basis shall be documented (legitimate interest for B2B marketing)
- **GDPR-402:** The system shall support honoring opt-out requests from contacts who do not wish to be contacted
- **GDPR-403:** A suppression list shall prevent re-import of contacts who have requested removal
- **GDPR-404:** PitchBook-sourced data shall be processed in accordance with PitchBook's data licensing terms

### 13.5 Data Protection by Design

- **GDPR-501:** Personal data shall be encrypted at rest and in transit
- **GDPR-502:** Access to personal data shall be logged for audit purposes
- **GDPR-503:** Data retention periods shall be configurable with automatic archival/deletion
- **GDPR-504:** The system shall support data residency requirements (EU data stored in EU)

---

## 14. White-Label Architecture

### 14.1 Design Principles

While white-labeling is not planned for initial launch, the system architecture shall support future white-label deployment to minimize refactoring costs.

#### 14.1.1 Multi-Tenancy Foundation

- **WL-101:** The system shall be built on a multi-tenant architecture with strong data isolation between organizations
- **WL-102:** Each tenant shall have independent configuration, branding assets, and customization settings
- **WL-103:** Tenant provisioning shall be automated and self-service capable

### 14.2 Branding Customization Points

#### 14.2.1 Visual Identity

- **WL-201:** The following branding elements shall be configurable per tenant:
  - Logo (header, login page, email templates, proposal templates)
  - Primary and secondary brand colors
  - Favicon
  - Login page background image
  - Email template headers/footers
  - Proposal cover page branding
- **WL-202:** CSS theming shall use design tokens/variables for easy color scheme changes
- **WL-203:** The system shall validate uploaded assets for size, format, and dimensions

#### 14.2.2 Terminology Customization

- **WL-210:** Pipeline stage names shall be configurable (as noted in Section 4.2)
- **WL-211:** Key system terminology shall be customizable (e.g., "Opportunity" → "Deal", "Account" → "Company")
- **WL-212:** Custom field labels shall support tenant-specific language

### 14.3 Domain and Email Configuration

- **WL-301:** The system shall support custom domain mapping (e.g., crm.clientbrand.com)
- **WL-302:** Email notifications shall support custom sender addresses and domains
- **WL-303:** SSL certificates shall be provisioned automatically for custom domains
- **WL-304:** Proposal viewing links shall use the tenant's custom domain

### 14.4 Feature Flagging

- **WL-401:** Feature flags shall control availability of specific features per tenant
- **WL-402:** Administrators shall be able to enable/disable features without code deployment
- **WL-403:** Feature usage shall be tracked per tenant for analytics and billing purposes

---

## 15. Technical Requirements

### 15.1 Platform Requirements

- **TR-101:** Web-based application accessible via modern browsers (Chrome, Firefox, Safari, Edge)
- **TR-102:** Mobile-responsive design for tablet and smartphone access
- **TR-103:** Native mobile apps for iOS and Android (Phase 2)
- **TR-104:** 99.9% uptime SLA
- **TR-105:** SOC 2 Type II compliance

### 15.2 Security Requirements

- **TR-201:** Role-based access control (RBAC) with customizable permission sets
- **TR-202:** Single Sign-On (SSO) support via SAML 2.0 and OAuth 2.0 (including CommandRoom.ai and AiCoaches.com SSO)
- **TR-203:** Data encryption at rest (AES-256) and in transit (TLS 1.3)
- **TR-204:** Audit logging of all data access and modifications
- **TR-205:** GDPR and CCPA compliance features including data export and deletion
- **TR-206:** Two-factor authentication (2FA) support for all users

### 15.3 Performance Requirements

- **TR-301:** Page load times under 2 seconds for standard views
- **TR-302:** Search results returned within 500ms
- **TR-303:** Support for 10,000+ contacts per organization without performance degradation
- **TR-304:** Real-time updates for collaborative features (activity feeds, notifications)
- **TR-305:** Daily PitchBook CSV imports shall complete within 1 hour for files up to 100,000 records
- **TR-306:** Proposal PDF generation shall complete within 5 seconds

### 15.4 API Requirements

- **TR-401:** RESTful API for all CRUD operations
- **TR-402:** Webhook support for event-driven integrations
- **TR-403:** Rate limiting with clear documentation
- **TR-404:** API versioning with 12-month deprecation notice
- **TR-405:** CommandRoom.ai API integration with OAuth 2.0 authentication
- **TR-406:** AiCoaches.com billing API integration with OAuth 2.0 authentication

### 15.5 Data Architecture

- **TR-501:** Multi-tenant database architecture with tenant isolation
- **TR-502:** Support for tenant-specific data residency (EU, US, APAC)
- **TR-503:** Automated backup with point-in-time recovery
- **TR-504:** Data archival strategy for inactive accounts

---

## 16. Success Metrics

### 16.1 Adoption Metrics

| Metric                     | Target                  | Measurement                            |
| -------------------------- | ----------------------- | -------------------------------------- |
| Daily Active Users         | 80% of subscribed users | Unique logins per day                  |
| Contact Engagement Rate    | 60% of contacts logged  | Contacts with 1+ activity in 30 days   |
| Org Chart Completion       | 50% of accounts         | Accounts with 3+ contacts in org chart |
| Communication Logging Rate | 90% of meetings         | Meetings with logged notes             |
| AI Feature Opt-In Rate     | 70% of users            | Users with AI consent enabled          |
| Proposal Creator Usage     | 80% of opportunities    | Opportunities with linked proposals    |

### 16.2 Business Impact Metrics

| Metric                      | Target                      | Measurement                           |
| --------------------------- | --------------------------- | ------------------------------------- |
| Deal Registration Conflicts | <5% of registrations        | Disputes requiring admin intervention |
| Pipeline Accuracy           | ±15% of forecast            | Actual vs. predicted close rates      |
| Sales Cycle Reduction       | 20% decrease                | Average days from Lead to Won         |
| Multi-Threading Rate        | 3+ contacts per opportunity | Average engaged stakeholders          |
| Subscription Renewal Rate   | >90%                        | Annual renewal percentage             |
| Proposal Conversion Rate    | >40%                        | Sent proposals that are accepted      |
| Average Proposal Discount   | <15%                        | Mean discount applied                 |

### 16.3 Platform Health Metrics

| Metric                        | Target              | Measurement                     |
| ----------------------------- | ------------------- | ------------------------------- |
| System Uptime                 | 99.9%               | Monthly availability            |
| PitchBook Import Success Rate | >99%                | Records processed without error |
| CommandRoom.ai Sync Success   | >99%                | Successful daily syncs          |
| AiCoaches.com Order Sync      | >99.5%              | Orders successfully created     |
| GDPR Request Fulfillment      | 100% within 30 days | Data access/deletion requests   |

---

## 17. Implementation Phases

### Phase 1: Foundation (Months 1-4)

**Core CRM Functionality**

- Account and contact management
- Basic pipeline and opportunity tracking
- Email integration (Gmail, Outlook)
- PitchBook daily CSV import pipeline
- Deal registration system
- Subscription and license management
- Commission tracking (85/10/5 split)

**Technical Foundation**

- Multi-tenant architecture (white-label ready)
- RBAC and user management
- Basic API framework

**Deliverables:**

- Functional CRM with HubSpot-like UX
- Working deal registration workflow
- Basic activity logging
- Subscription billing integration
- Commission dashboard

### Phase 2: Intelligence Layer (Months 5-8)

**Organizational Intelligence**

- Org chart visualization and editing
- CommandRoom.ai integration
- Stakeholder role tagging
- Cross-contact communication timeline
- Relationship mapping

**AI Features (with GDPR consent framework)**

- Automated org chart suggestions
- Communication sentiment analysis
- Deal risk scoring
- Granular consent management

**Compliance**

- Full GDPR compliance implementation
- Data export and deletion workflows
- Consent audit trails

### Phase 3: Proposal Creator and Billing Integration (Months 9-12)

**Product Catalog**

- Product catalog administration interface
- All five product categories configured
- Pricing management with tiers and effective dates
- Product bundles

**Proposal Creator**

- Proposal creation workflow
- Product selection and configuration
- Pricing and discount management
- Proposal templates and branding
- Electronic acceptance workflow
- Proposal tracking and analytics

**AiCoaches.com Integration**

- Billing API integration
- Order creation on proposal acceptance
- Invoice and payment status sync
- Commission calculation from invoiced amounts

**AI Enhancements**

- AI-assisted proposal content generation
- Product recommendations based on opportunity context
- Pricing optimization suggestions

### Phase 4: Advanced Capabilities (Months 13-16)

**Enhanced AI**

- Predictive deal scoring
- Next-best-action recommendations
- Competitive intelligence tracking

**Expansion**

- Native mobile apps
- Advanced reporting and dashboards
- Additional integrations (LinkedIn Sales Navigator, VoIP systems, DocuSign)
- White-label configuration UI (admin-facing)

---

## Appendix A: Glossary

| Term                  | Definition                                                                             |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Account**           | A company or organization being pursued as a customer                                  |
| **AiCoaches.com**     | The billing and fulfillment platform for AiCoaches service delivery                    |
| **CAIO**              | Chief AI Officer; a fractional executive service offering                              |
| **Champion**          | A contact who actively advocates for your solution internally                          |
| **CommandRoom.ai**    | Partner platform where companies can publish and maintain organizational charts        |
| **Deal Registration** | Formal claim by a salesperson on a specific opportunity                                |
| **Economic Buyer**    | The person with final budget authority                                                 |
| **Embedded Team**     | Full-time dedicated resources supplied to client organizations                         |
| **Multi-Threading**   | Engaging multiple stakeholders within an account                                       |
| **PitchBook**         | Third-party data provider for company and contact information                          |
| **Proposal**          | A formal offer document containing products, pricing, and terms                        |
| **Single-Threaded**   | Having a relationship with only one contact at an account                              |
| **Territory**         | A defined set of accounts assigned to a salesperson                                    |
| **White-Label**       | Customizable branding allowing the platform to appear under different brand identities |

---

## Appendix B: Product Category Summary

| Category                            | Delivery Model                          | Pricing Model                                | Billing Frequency |
| ----------------------------------- | --------------------------------------- | -------------------------------------------- | ----------------- |
| **Workshops**                       | In-person (full day), Online (4×90 min) | Per-participant (public), Flat fee (private) | Per event         |
| **AI Consulting / Fractional CAIO** | Monthly retainer                        | Tiered by hours                              | Monthly           |
| **Software**                        | SaaS subscription                       | Per-seat                                     | Monthly or Annual |
| **Certifications**                  | Exam + credential                       | One-time + annual renewal                    | One-time / Annual |
| **Embedded Teams**                  | Full-time resources                     | Per-resource monthly rate                    | Monthly           |

---

## Appendix C: Revision History

| Version | Date             | Author   | Changes                                                                                                                                                                                                         |
| ------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | January 21, 2026 | [Author] | Initial draft                                                                                                                                                                                                   |
| 1.1     | January 21, 2026 | [Author] | Added stakeholder decisions: licensing model, PitchBook CSV integration, data retention policy, commission structure (85/10/5), GDPR/AI consent framework, CommandRoom.ai integration, white-label architecture |
| 1.2     | January 21, 2026 | [Author] | Added Product Catalog (Section 7), Proposal Creator (Section 8), AiCoaches.com billing integration; five product categories: Workshops, AI Consulting/CAIO, Software, Certifications, Embedded Teams            |

---

## Appendix D: Resolved Questions

The following questions from v1.0 have been resolved:

| Question               | Resolution                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Pricing Model          | Licenses provided centrally; salespeople pay annual subscription fee                                            |
| PitchBook Licensing    | Daily CSV file updates (no direct API)                                                                          |
| Data Ownership         | All data retained by organization when salesperson leaves                                                       |
| Commission Calculation | Built-in: 85% salesperson, 10% head office, 5% advertising fund; calculated from AiCoaches.com invoiced amounts |
| AI Data Consent        | GDPR-compliant granular consent with opt-in for AI features                                                     |
| Org Chart Data Sources | PitchBook, LinkedIn, and CommandRoom.ai integration                                                             |
| White Labeling         | Architecture designed for future white-label; not initial launch feature                                        |
| Offline Access         | Not required for initial release                                                                                |

---

_End of Document_
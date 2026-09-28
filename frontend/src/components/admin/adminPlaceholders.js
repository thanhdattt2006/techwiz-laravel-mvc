/**
 * Placeholder mock data for Admin Moderation & Messages tabs (Phase 4.16).
 */
export const INITIAL_REVIEWS = [
  {
    id: 'REV-101',
    author: 'Elena Rostova (Lincoln Park)',
    market: 'Green City Market',
    farmer: 'Prairie Organic Grove',
    rating: 5,
    comment: 'The heirloom tomatoes had the most incredible aroma and sweetness. Picked up right on time at Stall #04!',
    status: 'PUBLISHED',
  },
  {
    id: 'REV-102',
    author: 'David M. (Logan Square)',
    market: 'Logan Square Farmers Market',
    farmer: 'Heritage Artisan Bakehouse',
    rating: 5,
    comment: 'Sourdough was still slightly warm from the wood-fired hearth. Easy cash settlement without any hassle.',
    status: 'PUBLISHED',
  },
  {
    id: 'REV-104',
    author: 'Spam Bot 99',
    market: 'Unknown',
    farmer: 'N/A',
    rating: 1,
    comment: 'Visit discountcrypto.com for fast loans and free tokens online!!!',
    status: 'HIDDEN',
  },
];

export const INITIAL_INQUIRIES = [
  {
    id: 'MSG-401',
    sender: 'Claire Kensington',
    email: 'claire.k@gmail.com',
    subject: 'Waitlist for spring seedling vendors at Lincoln Park?',
    message: 'Hello, our family nursery in McHenry County specializes in heirloom vegetable starts. When do Spring 2027 stall applications open?',
    status: 'NEW',
    date: 'Oct 23, 2026',
  },
  {
    id: 'MSG-402',
    sender: 'Carlos Gutierrez',
    email: 'carlos.g@pilsenarts.org',
    subject: 'Proposal for bilingual nutrition workshops at Pilsen Community Market',
    message: 'We would love to coordinate with MarketLink to distribute free SNAP/LINK matching coupon booklets for fresh vegetables.',
    status: 'RESOLVED',
    date: 'Oct 21, 2026',
  },
];

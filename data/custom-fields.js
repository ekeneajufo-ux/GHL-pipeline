module.exports = [
  { name: 'lead_source',              dataType: 'TEXT',     placeholder: 'Track where lead came from' },
  { name: 'product_purchased',        dataType: 'TEXT',     placeholder: 'What product they bought' },
  { name: 'subscription_type',        dataType: 'TEXT',     placeholder: 'Subscription name if applicable' },
  { name: 'discovery_call_booked',    dataType: 'CHECKBOX', placeholder: 'Did they book a call?' },
  { name: 'nurture_sequence_active',  dataType: 'CHECKBOX', placeholder: 'Are they in nurture emails?' },
  { name: 'guide_sent_date',          dataType: 'DATE',     placeholder: 'When teaser was sent' },
  { name: 'purchase_date',            dataType: 'DATE',     placeholder: 'When they purchased' },
  { name: 'stripe_customer_id',       dataType: 'TEXT',     placeholder: 'Stripe customer ID for tracking' },
  { name: 'discovery_call_date',      dataType: 'DATE',     placeholder: 'When is their call?' },
];

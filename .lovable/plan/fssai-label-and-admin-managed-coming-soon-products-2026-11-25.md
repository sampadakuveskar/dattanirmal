# FSSAI Label and Admin-Managed Coming Soon Products

## What will change
- Keep the FSSAI footer label clearly pending until the issued number is provided; never display a fabricated number. Correct the footer phone link.
- Keep the homepage’s shared “Coming Soon from Konkan” section and connect it to seasonal products managed in the Admin Panel.
- Add a simple Admin Panel section to create, edit, show/hide, and remove upcoming product announcements. Each entry will have a product name, short description, and expected month; the homepage will show an honest empty state until entries are added.

## Technical details
- Store upcoming announcements separately from purchasable products, so checkout, prices, stock, orders, customer accounts, and existing product settings remain unchanged.
- Add an isolated database table with public read access only for published announcements and admin-only management, enforced by the existing admin-role checks and row security.
- Use existing local imagery and design patterns; no image upload or payment/auth changes are included.
- Verify the admin and public views, the FSSAI footer label, desktop/mobile layouts, and build diagnostics.
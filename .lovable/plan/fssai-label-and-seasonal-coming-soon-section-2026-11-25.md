# FSSAI Label and Seasonal Coming Soon Section

## What will change
- Add a clearly temporary FSSAI registration label to the site footer. No made-up license number will be shown; the real number can replace the pending label when supplied.
- Add a shared “Coming Soon” area to the homepage for seasonal foods, with an honest empty state until real product details are available and a link to the existing seasonal newsletter signup.
- Correct the footer phone link so it calls the displayed business number.

## Technical details
- Keep this frontend-only: no database, authentication, checkout, roles, or admin changes.
- Use the existing design system and existing local product imagery; do not invent product names or availability dates.
- Verify the homepage and footer at desktop and mobile widths, then check the build diagnostics.
# DattaNirmal Farms — Backend Documentation

A plain-English guide to how the website stores and shows your customers, orders and enquiries.
No coding knowledge needed.

---

## A. How it all fits together

```text
Customer  →  Website (dattanirmal.lovable.app)  →  Backend (server functions)  →  Database  →  /admin dashboard
```

1. A customer browses the site and adds products to the cart (cart is stored in their own browser).
2. At checkout they must sign in. If they have no account, one is created.
3. When they press "Place order", the website calls a secure **server function** which writes the
   order into the database. The browser never talks to the database directly for anything sensitive.
4. You open **/admin** and see the order instantly.

The same happens for the contact form: it saves a row in the **enquiries** table, which you see in
the "Leads / Enquiries" tab of /admin.

---

## B. Authentication (accounts and login)

- Sign in page: **/auth**
- Methods: email + password, and Google sign-in.
- On first sign-up the system automatically creates:
  - a row in **profiles** (name, phone)
  - a row in **user_roles** with the role `customer`
- Admin access is a separate row in **user_roles** with the role `admin`.
- Pages under "account" and "admin" are protected — signed-out visitors are sent to /auth.
- The `/admin` page also re-checks the admin role **on the server**, so nobody can fake it in the browser.

### Your two admin accounts

| Admin | Email |
| --- | --- |
| Admin 1 | sampadakuveskar505@gmail.com |
| Admin 2 | shubhamprabhu5909@gmail.com |

Both already have the `admin` role. Each logs in with their own email and password at
`https://dattanirmal.lovable.app/auth`, then goes to `https://dattanirmal.lovable.app/admin`
(or clicks "Admin Panel" on the Account page).

> If a role change doesn't appear, sign out and sign in once more to refresh the session.

---

## C. The database tables

| Table | What it holds | Who can read it |
| --- | --- | --- |
| **profiles** | Customer name + phone, one row per account | The customer themselves |
| **user_roles** | Which accounts are `admin` / `customer` | The customer themselves |
| **products** | Live catalogue: name, category, price, MRP, stock, active/inactive | Everyone (active items); admins see all |
| **orders** | One row per order: customer details, address, delivery + payment method, amounts, status | The customer who placed it, and admins |
| **order_items** | The individual products inside each order | Same as the parent order |
| **enquiries** | Contact-form leads: name, email, phone, subject, message, status, date | Admins only (anyone may submit) |

Every table has **Row Level Security** on, meaning the database itself refuses to hand data to
someone who isn't allowed to see it.

### Key columns in `orders`

`order_number` (e.g. KK-123456), `full_name`, `email`, `phone`, `address1`, `address2`, `city`,
`state`, `pincode`, `delivery_method` (standard/express), `payment_method` (upi/card/netbanking/cod),
`subtotal`, `shipping`, `total`, `status`, `created_at`.

Order status values: `placed` → `packed` → `shipped` → `delivered` (and `cancelled`).

---

## D. The order flow, step by step

1. Customer adds items to cart → `/cart`.
2. `/checkout` collects: customer details → address → delivery method → payment method.
3. Pressing "Place order" requires sign-in (they are redirected to `/auth` if signed out).
4. The server function `createOrder`:
   - recalculates the subtotal and shipping **on the server** (so prices can't be tampered with),
   - inserts one row into `orders` and one row per product into `order_items`,
   - returns the order number shown on the confirmation screen.
5. The customer sees the order on `/account`; you see it on `/admin`.

Shipping rule: Express = ₹350. Standard = ₹120, free above ₹2,500.

---

## E. Where to see your data

### The easy way — the Admin Dashboard

Go to **/admin** (sign in first). Three tabs:

- **Orders** — every order, newest first, with customer name, contact, address, items and total.
  Change the status from the dropdown; the customer's tracking view updates immediately.
- **Products** — edit live price and stock, and switch a product on/off. Changes appear on the shop
  and product pages straight away.
- **Leads / Enquiries** — every contact-form submission with name, email, phone, message and date.
  Mark each one `new` → `contacted` → `closed`.

Top of the page shows total revenue, order count and product count.

### The other way — the backend data browser

Open the backend from the Lovable editor ("View Backend"). It gives a spreadsheet-like view of every
table. Sort by `created_at` descending to see newest first. Useful for exporting or double-checking,
but for day-to-day work `/admin` is easier.

### How to spot what's new

- **New orders**: status is `placed`, sorted at the top of the Orders tab.
- **New leads**: status is `new` in the Leads tab.

---

## F. Security notes

- No API keys or passwords are stored in the website code. Only the public "publishable" key is
  visible in the browser, which is designed to be public and is useless without permission rules.
- The service/admin key never leaves the server.
- Admin checks happen on the server with a database function (`has_role`), not in the browser.
- Row Level Security is enabled on every table.
- Card details are never stored on this site — no payment gateway is connected yet, so
  `payment_method` records only the customer's stated intent.

---

## G. Notifications (currently pending)

No emails or SMS are sent when an order or enquiry arrives. Admins must check `/admin`.

To turn on email notifications you first need an email domain you own (for example
`dattanirmal.com`); free/Gmail addresses cannot be used as senders. Once a domain is added in the
project's email setup, order-confirmation and new-lead emails can be switched on.

---

## H. Troubleshooting

| Problem | What to do |
| --- | --- |
| "I can't open /admin" | Make sure you are signed in with an admin email; sign out and in again. |
| "A customer says their order is missing" | Check the Orders tab and search by their email or phone. |
| "Prices on the shop look wrong" | Update them in the Products tab of /admin — the shop reads live values. |
| "A product should be hidden" | Set it to inactive in the Products tab. |
| "Contact form message never arrived" | Check the Leads / Enquiries tab; there is no email alert yet. |
| "Google sign-in fails" | Confirm the Google provider is still enabled in the backend auth settings. |

---

## I. Things intentionally not built yet

- Live payment gateway (Razorpay/Stripe) — orders record a payment method only.
- Email/SMS notifications (see section G).
- Invoices/PDF receipts, coupons stored in the database, shipping-partner tracking API.

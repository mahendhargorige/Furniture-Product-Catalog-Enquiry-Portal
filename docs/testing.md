# Sri Venkata Sai Furniture Portal - Manual Testing Checklist

Below is the verification checklist for testing the Furniture Product Catalog & Enquiry Portal from end-to-end.

## Phase 1: Client Portal - Browsing & Submission Flow

1. **Homepage Loading**:
   - Navigate to `http://localhost:3000/`.
   - Verify SVS branding logo, fonts, hero sections, and category widgets.
   - Verify the featured products loading skeleton is displayed, then replaced by the 4 pinned featured items.

2. **Catalog Browsing**:
   - Click "Browse Catalog" or navigate to `/catalog`.
   - Click on different category filters (Home, Office, Export, Custom) and verify that items update instantly.
   - Type keyword "Teak" in the search box. Verify only items containing "Teak" in description or name show up.
   - Adjust Price limits (Min and Max) and verify list updates accordingly.
   - Switch Sort order dropdown (Low to High, A-Z) and verify list rearrangements.
   - Click "Reset All" and verify filters clear.

3. **Product Detail View**:
   - Click "View Details" on the "Royal Teak Wood Sofa Set".
   - Verify that description text, specifications table (Material, Dimensions), and Price range are loaded correctly.
   - Verify related product recommendations appear in the bottom row.
   - Click a related product; verify page scrolls to top and reloads detail contents for the new item.

4. **Enquiry Pre-Filling**:
   - On "Teak Wood Carved Door" page, click the "Request Price Quote & Details" button.
   - Verify you are redirected to the `/enquire` page, and the "Product of Interest" dropdown is automatically pre-selected to "Teak Wood Carved Door".

5. **Client Form Validation**:
   - Try to submit the form empty. Verify toast warning appears.
   - Enter name, location, and an invalid phone number (e.g. `123`). Verify validation message: "Please enter a valid 10-digit mobile number."
   - Enter an invalid email address (e.g. `test@domain`). Verify validation toast message: "Please enter a valid email address."

6. **Enquiry Submission Success**:
   - Complete valid inputs (Name: "Vinay Rao", Mobile: "9988776655", Email: "vinay@gmail.com", Location: "Kukatpally, Hyd", Qty: 2, custom notes: "Requires dark walnut polish").
   - Click "Submit Enquiry".
   - Verify loader overlay/status indicator changes.
   - Verify success screen showing confirmation details, custom reference ID (e.g. `#SVS-3`), and a WhatsApp quick contact.

---

## Phase 2: Administrative Portal - Tracking & Inventory Flow

1. **Authentication Error**:
   - Navigate to `/login`.
   - Enter wrong credentials (e.g., `admin@svsfurniture.com` and `wrongpass`).
   - Verify error toast: "Authentication failed. Please verify email and password."

2. **Authentication Success**:
   - Enter correct credentials:
     - **Email**: `admin@svsfurniture.com`
     - **Password**: `admin123`
   - Click "Access Dashboard".
   - Verify successful redirection to `/admin`.

3. **Dashboard Real-time Counters**:
   - Verify overall counters (Total Products, Total Enquiries, Pending) reflect the newly submitted enquiry (Total Enquiries should increment, Pending should increase).
   - Check "Recent Enquiries" list. Verify "Vinay Rao" appears at the top.
   - Verify category distribution bar charts render.

4. **Enquiry Logs Follow-Up**:
   - Click "Manage" next to "Vinay Rao"'s record.
   - Verify details card (email, location) and enquired product thumbnail load.
   - Verify WhatsApp quick link is correctly formatted:
     - Hover link, check that phone matches `919988776655`.
   - Change Status dropdown from "New" to "In Progress".
   - Verify that an automatic timeline entry logs the transition: "Status updated from 'New / Open' to 'In Progress'".
   - Type follow-up remark: "Spoke to Vinay. He agreed to walnut polish. Drafting commercial quote." Click "Log Note".
   - Verify note appears at the top of the history timeline with time-stamp and author "SVS Admin".

5. **Catalog Product Creation**:
   - Navigate to `/admin/products`.
   - Click "Add New Product".
   - Input fields:
     - Name: "Modern Mahogany Coffee Table"
     - Category: "Home Furniture"
     - Material: "Mahogany & Tempered Glass"
     - Dimensions: "3ft x 2ft x 1.5ft"
     - Min Price: `15000`
     - Max Price: `22000`
     - Image URL: (leave blank or input unspash link)
     - Description: "Sleek wooden coffee table with floating shelf."
     - Check: "Pin to Featured Collection"
   - Click "Register Product". Verify success toast.
   - Verify that "Modern Mahogany Coffee Table" now appears in the product inventory list.

6. **Catalog Product Editing & Deletion**:
   - Click "Edit" icon next to "Modern Mahogany Coffee Table".
   - Change Min Price to `16000` and uncheck "Featured". Click "Save Specs".
   - Verify update changes save.
   - Click "Delete" icon on "Modern Mahogany Coffee Table". Confirm deletion.
   - Verify table list updates and item is removed.

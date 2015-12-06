# App User Process #

The purpose of this doc is to describe what the usual process in Digital Dining (DD after) is, and how this interacts with the database.
We assume for the bellow, that the client is arriving in a restaurant, and that this restaurant has uploaded all it's data to DD.

## App User Process ##

In the home page, the client chooses the restaurant and checks in the restaurant, inputing the party size.
This creates a new entry in the parties table, with checkin_at filled.
This provides a party ID to the client
It also adds the user to the `party_participants` table. At any moment, other users can enter a `party_id` in the app, to join the party and be added to `table_participants`.

The restaurant can see all the opened parties waiting to be seated.
If the restaurant or the client want to cancel the reservation, the closed_at field is filled (removing this party from the queue).

Once a table is free, the waiter sits the party, filling the table number field, and the seated_at (automatically).
This enables the any `party_particpant` to add menuItems to the party (only in redis), and confirm this to the kitchen (this stores it in the db, and the restaurant now knows it has been ordered).
Once ordered, an item cannot be canceled, except maybe by a restaurant staff (to be discussed), filling the canceled_at field.

As items are served, the corresponding served_at field is filled.
At any time when all the orderd items are served, a `party_participant` can ask for the bill.

Each user can see the check, and pay for items that are not yet paid.
Once all elements are paid, the party can be closed (by the waiter or automatically, to discuss), and the table is available again (in `tables`).

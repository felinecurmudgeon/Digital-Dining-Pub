#API Documentation

##Users API
| HTTP Method   | URL           | Description 
| ------------- | ------------- | ---------------------------------
| GET           | /users        | Gets all users
| GET           | /users/:id    | Gets specific user for a given id
| POST          | /users        | Creates a new user
| PUT           | /users        | Updates a user profile

### Users API GET query string parameters
| Parameter     | Values           |
| ------------- | -------------    | 

### Example POST
TBD


## Payments API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| GET           | /users/:id/payment     | Gets all payment methods for a given user from Stripe
| POST          | /users/:id/payment     | Adds a payment method for a given user in Stripe
| PUT           | /users/:id/payment/:id | Updates a payment method for a given user in Stripe
| DELETE        | /users/:id/payment/:id | Removes a payment method from a given user in Stripe

- Note: this API follows a nested pattern due to the tight coupling of payment methods and users

### Example POST
TBD


## Charge API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| POST          | /user/:id/charge/:id | Updates the order + charges the customer CC via Stripe APIs
| DELETE        | /user/:id/charge/:id | Refunds the charges the customer CC via Stripe APIs

### Example POST
TBD


## Restaurants API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /restaurants       | Gets all restaurants
| GET           | /restaurants/:id   | Gets a specific restaurant
| POST          | /restaurants       | Creates an restaurant
| PUT           | /restaurants/:id   | Updates an restaurant
| DELETE        | /restaurants/:id   | Deletes an restaurant

### Restaurants API GET query string parameters
| Parameter     | Values           |
| ------------- | -------------    | 

### Example POST
TBD


## Menus API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /menus       | Gets all menus
| GET           | /menus/:id   | Gets a specific menu
| POST          | /menus       | Creates an menu
| PUT           | /menus/:id   | Updates an menu
| DELETE        | /menus/:id   | Deletes an menu

### Menus API GET query string parameters
| Parameter     | Values           |
| ------------- | -------------    | 
| restaurantsid | id (i.e. 123)  |

### Example POST
TBD

## Orders API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /orders       | Gets all orders
| GET           | /orders/:id   | Gets a specific order
| POST          | /orders       | Creates an order
| PUT           | /orders/:id   | Updates an order
| DELETE        | /orders/:id   | Deletes an order

### Orders API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------   | 
| restaurantsid | id (i.e. 123)  |

### Example POST
TBD


## OrdersItems API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| GET           | /orders/:id/items     | Gets all items for a given order
| GET           | /orders/:id/items/:id | Gets a specific item on a given order
| POST          | /orders/:id/items     | Adds an item to a specific order
| DELETE        | /orders/:id/items/:id | Removes an item from a specific order    

- Note: this API follows a nested pattern due to the tight coupling of orders and order items.

### Example POST
TBD


## Reservations API
| HTTP Method   | URL                    | Description
| ------------- | ---------------------- | ---------------------------------
| GET           | /reservation           | Gets all reservations
| GET           | /reservation/:id       | Gets a specific reservations
| POST          | /reservation           | Creates a new reservation
| PUT           | /reservation/:id       | Updates a existing reservation
| DELETE        | /reservation/:id       | Deletes an existing reservation

### Reservation API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------  | 
| restaurantsid | id (i.e. 123)  |
| usersid | id (i.e. 123)  |

### Example POST
TBD




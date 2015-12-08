#API Documentation

##Users API
| HTTP Method   | URL           | Description 
| ------------- | ------------- | ---------------------------------
| GET           | /users        | Gets all users
| GET           | /users/:uid   | Gets specific user for a given id
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
| GET           | /users/:uid/payment     | Gets all payment methods for a given user from Stripe
| POST          | /users/:uid/payment     | Adds a payment method for a given user in Stripe
| PUT           | /users/:uid/payment/:payid | Updates a payment method for a given user in Stripe
| DELETE        | /users/:uid/payment/:payid | Removes a payment method from a given user in Stripe

- Note: this API follows a nested pattern due to the tight coupling of payment methods and users

### Example POST
TBD


## Charge API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| POST          | /user/:uid/charge/:cid | Updates the order + charges the customer CC via Stripe APIs
| DELETE        | /user/:uid/charge/:cid | Refunds the charges the customer CC via Stripe APIs

### Example POST
TBD

## RestaurantUsers API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /restaurants       | Gets all restaurants
| GET           | /restaurants/:rid   | Gets a specific restaurant
| POST          | /restaurants       | Creates an restaurant

### Example POST
`{username: "Timmy", password:'12345'}`


## Restaurants API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /restaurants       | Gets all restaurants
| GET           | /restaurants/:rid   | Gets a specific restaurant
| POST          | /restaurants       | Creates an restaurant
| PUT           | /restaurants/:rid   | Updates an restaurant
| DELETE        | /restaurants/:rid   | Deletes an restaurant

### Restaurants API GET query string parameters
| Parameter     | Values           |
| ------------- | -------------    | 

### Example POST
TBD


## Menus API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /menus       | Gets all menus
| GET           | /menus/:mid   | Gets a specific menu
| POST          | /menus       | Creates an menu
| PUT           | /menus/:mid   | Updates an menu
| DELETE        | /menus/:mid   | Deletes an menu

### Menus API GET query string parameters
| Parameter     | Values           |
| ------------- | -------------    | 
| restaurantsid | rid (i.e. 123)  |

### Example POST
TBD

## Party API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /parties       | Gets all parties
| GET           | /parties/:pid   | Gets a specific party
| POST          | /parties       | Creates a party
| PUT           | /parties/:pid   | Updates a party
| DELETE        | /parties/:pid   | Deletes a party

### Party API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------   | 
| restaurantsid | rid (i.e. 123)  |

### Example POST
TBD


## OrdersItems API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| GET           | /parties/:pid/menuitems     | Gets all menu items for a given party
| GET           | /parties/:pid/menuitems/:mid | Gets a specific item on a given party
| POST          | /parties/:pid/menuitems     | Adds item(s) to a specific party
| DELETE        | /parties/:pid/menuitems/:mid | Removes an item from a specific party    

- Note: this API follows a nested pattern due to the tight coupling of parties and menu items.

### Example POST
TBD


## Reservations API
| HTTP Method   | URL                    | Description
| ------------- | ---------------------- | ---------------------------------
| GET           | /reservations           | Gets all reservations
| GET           | /reservations/:resid       | Gets a specific reservations
| POST          | /reservations           | Creates a new reservation
| PUT           | /reservations/:resid       | Updates a existing reservation
| DELETE        | /reservations/:resid       | Deletes an existing reservation

### Reservation API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------  | 
| restaurantsid | rid (i.e. 123)  |
| usersid | uid (i.e. 123)  |

### Example POST
TBD




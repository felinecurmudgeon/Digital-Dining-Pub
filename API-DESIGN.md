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
| POST          | /charge/addcard | Updates the order + charges the customer CC via Stripe APIs
| POST          | /charge | Updates the order + charges the customer CC via Stripe APIs
| DELETE        | /charge/:cid | Refunds the charges the customer CC via Stripe APIs

### Example POST
TBD

## RestaurantUsers API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /restaurantusers       | Gets all restaurant user
| GET           | /restaurantusers/:id   | Gets a specific restaurant user
| POST          | /restaurantusers       | Creates an restaurant user

### Example POST
`
{
  username: "Timmy", 
  password:'12345'
}
`


## Restaurants API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /restaurants       | Gets all restaurants
| GET           | /restaurants/:id   | Gets a specific restaurant
| POST          | /restaurants       | Creates an restaurant
| PUT           | /restaurants/:id   | Updates an restaurant
| DELETE        | /restaurants/:id   | Deletes an restaurant


### Example POST
`
{ 
  restaurant_name: 'Carls Cake',
  restaurant_owner_id: 33, <==must be valid restaurant_owner_id
  restaurant_address: '1234 Pine St.',
  restaurant_city: 'Tuscon', 
  restaurant_state: 'AZ', 
  restaurant_zip_code: '75111'
}
`


## MenusCategories API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /menucategories       | Gets all menucategories
| POST          | /menucategories       | Creates an menucategories

### Example POST
`
{ 
  "restaurant_id": 185, <==must be valid restaurant_id
  "category_name" : "brunch"
}
`

## MenuItems API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /menuitems?rid=restaurantid   | Gets all menuitems for a given restaurant
| POST          | /menuitems       | Creates a menuitems
| PUT           | /menuitems/:id       | Updates a menuitems
| DELETE        | /menuitems/:id       | Deletes a menuitems

### Party API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------   | 
| rid | restaurantsid (i.e. 123)  |


### Example POST
`{
  restaurant_id : 31 <==must be valid restaurant_id 
  title : 'hot soup',
  description : 'More delicious turtle soup',
  price: '10.99',
  menu_category_id : 7 <==must be valid menu_category_id
}
`

## Party API
| HTTP Method   | URL           | Description
| ------------- | ------------- | ---------------------------------
| GET           | /parties?rid=restaurantid&status=status       | Gets all parties
| GET           | /parties/:pid   | Gets a specific party
| POST          | /parties       | Creates a party
| PUT           | /parties/:pid?event=nameofevent   | Updates a party
| DELETE        | /parties/:pid   | Deletes a party

### Party API GET query string parameters
| Parameter     | Values          |
| ------------- | -------------   | 
| restaurantsid | rid (i.e. 123)  |
| partyid | pid (i.e. 123)  |
| status | optional: 'waiting','seated', 'canceled','ended'  |

### Example POST
`
{
  "restaurant_id" : "337", 
  "party_size" : "5", 
  "user_id" : "96"
}
`


## OrdersItems API
| HTTP Method   | URL                   | Description
| ------------- | -------------------   | ---------------------------------
| GET           | /parties/:pid/menuitems     | Gets all menu items for a given party
| POST          | /parties/:pid/menuitems     | Adds item(s) to a specific party
| DELETE        | /parties/:pid/menuitems/:mid | Removes an item from a specific party    

- Note: this API follows a nested pattern due to the tight coupling of parties and menu items.

### Example POST
`{party_id: 109, user_id: 32, menu_items [{menu_item_id: 12, quantity: 1}, {menu_item_id: 17, quantity: 10}]`


### Example POST
TBD




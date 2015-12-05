var data = {
  restaurantUsers: [
    {username: 'toto',
    password: 'pwd'},
    
    {username: 'emilio',
    password: 'qwerty'},
    
    {username: 'ZinedineZidane',
    password: 'france98'},
    
    {username: 'tobias',
    password: '12345'}
  ],

  restaurants: [
    {restaurant_name: 'Pizza Pino',
    restaurant_owner_id: 1,
    restaurant_adress: '944 Market Street',
    restaurant_city: 'San Francisco',
    restaurant_state: 'California',
    restaurant_zip_code: 94102},

    {restaurant_name: 'Happy Burgers',
    restaurant_owner_id: 2,
    restaurant_adress: '234 Mission Street',
    restaurant_city: 'San Francisco',
    restaurant_state: 'California',
    restaurant_zip_code: 94105},
    
    {restaurant_name: 'Chez Denise',
    restaurant_owner_id: 3,
    restaurant_adress: '9 avenue de l\'indépendance américaine',
    restaurant_city: 'San Francisco',
    restaurant_state: 'California',
    restaurant_zip_code: 94122,
    opening_hour_monday:'11:00:00',
    closing_hour_monday: '22:30:00',
    opening_hour_tuesday:'11:00:00',
    closing_hour_tuesday: '22:30:00',
    opening_hour_wednesday: '00:00:00',
    closing_hour_wednesday: '00:00:00',
    opening_hour_thursday: '11:00:00',
    closing_hour_thursday: '22:30:00',
    opening_hour_friday: '11:00:00',
    closing_hour_friday: '25:00:00',
    opening_hour_saturday: '11:00:00',
    closing_hour_saturday: '25:00:00',
    opening_hour_sunday: '00:00:00',
    closing_hour_sunday: '00:00:00'},
    
    {restaurant_name: 'Lolinda',
    restaurant_owner_id: 4,
    restaurant_adress: '2518 Mission St',
    restaurant_city: 'San Francisco',
    restaurant_state: 'California',
    restaurant_zip_code: 94110}
  ],

  menuCategories: [
    {restaurant_id: 1,
    category_name: 'Appetizer'},
    
    {restaurant_id: 1,
    category_name: 'Drinks'},
    
    {restaurant_id: 2,
    category_name: 'Soups'},
    
    {restaurant_id: 2,
    category_name: 'Deserts'},
    
    {restaurant_id: 3,
    category_name: 'Appetizer'},
    
    {restaurant_id: 3,
    category_name: 'Drinks'},
    
    {restaurant_id: 3,
    category_name: 'Soups'},
    
    {restaurant_id: 3,
    category_name: 'Deserts'}
  ],

  menuItems: [
    {restaurant_id: 1,
    title: 'Prosciutto', 
    description: 'ham and bread with small sliced tomatoes', 
    price: 5.95,
    menu_category_id: 1},
    
    {restaurant_id: 3,
    title: 'Onion Soup', 
    price: 8.85,
    menu_category_id: 7},
    
    {restaurant_id: 4,
    title: 'Angus Steak', 
    price: 12},
  ]
};

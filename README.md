## Carvolution - The Evolution of Mobility

This is a small ride hailing project where a user can schedule a ride with just their email, starting position, and final destination. The Google Maps API will automatically generate the coordinates for the ride. 

# Deployment Steps

To run the project locally, you must first clone or download it. With Docker running, execute the following commands:

`docker-compose build`

`docker-compose up`

The project runs on port 3001

This will start the project in your local environment. If this is your first time running the project, remember that you must seed the database with initial data to perform tests. To do this, execute:

`docker exec -it cavolution-app-container sh`

`yarn run seed`

# TEST

To run the tests, you must execute:

`docker exec -it cavolution-app-container sh` (If it has not been run previously.)

`yarn run test`

# Usage
## ¡Important: For testing purposes, you must use the rider with the email: jaimealberto@example.com!.

### Create a Ride
`{{host}}/ride` ---> POST 
Request : 

{

    "pickupLocation":  "chipre manizales", 
    "dropOffLocation": "clinica santillana ",
    "email": "jaimealberto@example.com"
}


### Finish a Ride 
Once the ride is finished, an event will be generated for the payment of that ride, with the calculated ride value and distance.

`{{host}}/ride/finish`---> PUT

Request : 


{

    "rideId": 2

}

### "Get payments made by user (including the payment method used)."

`{{host}}/users/findPayments/{{email}}` --> GET


# Conclusion

Carvolution is an easy-to-use ride hailing project that leverages the power of the Google Maps API. Follow the steps above to deploy the project locally and start using it today!
# restful-api-planning
Module 4 assignment 3
Project Overview

The AKC Breed Explorer is a Python Flask web application designed to help users research dog breeds and understand the advantages and disadvantages of owning different breeds. Users can search for breeds, review breed characteristics, compare two breeds, and explore general care requirements.

The application will use REST API communication, JSON data, and JavaScript Fetch requests to retrieve and display breed information.

1. API Selection

The public API selected for this project is the Dog API (dogapi.dog). This API provides information about dog breeds, breed groups, images, and facts through RESTful endpoints that return JSON data.

The API is suitable for this assignment because it provides structured information that can be incorporated into a dog breed research application. Information such as breed names, descriptions, weight, lifespan, and breed groups can help users understand the characteristics of different dogs.

The API does not require an API key, making it convenient for educational projects and application development.

The project will also reference the official American Kennel Club (AKC) website to provide additional breed information and reliable breed-specific resources.

The public API provides general breed characteristics, while the application will supplement that information with researched pros and cons. These advantages and disadvantages will help users evaluate whether a particular breed fits their lifestyle, living arrangements, and activity level.

API documentation: https://dogapi.dog/docs/api-v2

2. Endpoint Mapping

The application will use RESTful endpoints to retrieve, organize, and submit dog breed information.

The public API uses the base URL:

https://dogapi.dog/api/v2

The following public API endpoints will be used:

HTTP Method       Endpoint                              Purpose
GET              /breeds                                Retrieve available dog breeds.
GET              /breeds/{id}                           Retrieve information about a specific breed.
GET              /groups                                Retrieve available dog breed groups.
GET              /groups/{id}                           Retrieve information about a specific breed group.
GET              /facts                                 Retrieve general dog facts.


The Flask application will also provide its own endpoints:

HTTP Method    Flask Endpoint                          Purpose
GET            /api/breeds                             Retrieve breed profiles and support searching and filtering.
GET            /api/breeds/{slug}                      Retrieve information about one specific breed.
GET            /api/groups                             Retrieve available breed groups. 
POST           /api/breeds                             Submit and save a new breed profile.


These endpoints follow REST principles by identifying resources through URLs and using standard HTTP methods to perform operations.

Resource Identification: Each breed will be identified through a unique resource identifier.

Statelessness: Each request will contain the information necessary for the server to process it without relying on previous requests.

Standard HTTP Methods: GET will retrieve information, while POST will submit new breed information. Additional methods, such as PUT, PATCH, and DELETE, could be implemented if the application is expanded to support editing and removing profiles.

The public API provides breed information, while the Flask endpoints organize and manage the information used by the application.

3. Data Flow Diagram (Textual)

The application will use JavaScript Fetch API requests to communicate with the Flask backend and retrieve information from the public Dog API.

The data flow will follow these steps:

User Opens Application: The user opens the AKC Breed Explorer webpage.

Request Data: JavaScript initiates an asynchronous GET request using the Fetch API to retrieve dog breed information.

Public API Communication: The Flask backend retrieves information from the public Dog API using an HTTP GET request.

Process JSON Response: The backend receives the JSON response, processes the available breed information, and organizes the data for the frontend.

Display Loading Indicator: While information is being retrieved, the webpage displays a loading message so users know the application is working.

Render Breed Information: JavaScript processes the returned JSON data and dynamically creates HTML elements to display breed names, descriptions, lifespan, size, temperament, and other characteristics.

Conditional Styling: CSS classes will be applied based on the information being displayed. For example:

Green styling will identify the advantages (pros) of a breed.

Red styling will identify potential disadvantages (cons).

Different labels or styles can identify activity levels, sizes, and other breed characteristics.

Error Handling: If the public API or backend cannot retrieve the requested information, the application will display an understandable error message rather than leaving the webpage blank.

User Interaction: Users can search for specific breeds, filter results by breed group or size, and compare two breeds.

Form Submission: If a user submits a new breed profile, JavaScript will validate the information, convert it into JSON using JSON.stringify(), and submit it to the Flask backend through a POST request.

The application will use the Fetch API asynchronously so that users can interact with the webpage without requiring a complete page reload.

Data Flow Summary

User → Web Browser → JavaScript Fetch API → Flask Backend → Public Dog API → JSON Response → Flask Processing → JavaScript Rendering → User Interface

4. Dynamic Rendering and Conditional Styling

The application will use JavaScript to dynamically display breed information returned from the API.

JSON responses will be processed using JavaScript loops and DOM methods to create breed cards and comparison tables.

Each breed card will display relevant characteristics, including breed name, group, size, lifespan, temperament, grooming requirements, and activity level.

The application will also display separate sections for the pros and cons of owning each breed.

Conditional CSS styling will make the information easier to understand. Advantages will be displayed with green styling, while disadvantages will use red styling. Activity levels and other characteristics may also receive different visual labels.

5. Form Handling and Validation

The application will include a form that allows users to submit additional breed profiles.

The form will collect:

Breed Name: Required; cannot be blank.

Breed Group: Required; must contain a valid group name.

Size: Required; must be Small, Medium, or Large.

Lifespan: Required; must contain a valid lifespan description.

Activity Level: Required; must contain a description.

Grooming Requirements: Required; cannot be blank.

Temperament: Required; cannot be blank.

Pros: Required; must contain at least one advantage.

Cons: Required; must contain at least one disadvantage.

AKC Reference URL: Required; must be a valid URL.

JavaScript will validate the form before submission. Once validation succeeds, the information will be converted into a JSON object using JSON.stringify().

The Fetch API will send the JSON object to the Flask backend through a POST request. The backend will perform additional validation before saving the information.

6. Conclusion

The AKC Breed Explorer will demonstrate how Python Flask, REST APIs, JSON, and JavaScript can work together to create an interactive web application.

By combining public dog breed information with additional research about the advantages and disadvantages of individual breeds, the application will provide users with a useful resource for comparing dogs and understanding their ownership requirements.

The project will demonstrate REST principles, asynchronous Fetch API communication, dynamic webpage rendering, conditional CSS styling, and form validation.

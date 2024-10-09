# OJS Statistics Server

This project provides a REST API server that offers statistics for the Open Journal Systems (OJS) platform. It retrieves information such as the number of articles, journals, and issues for a specified journal hosted on the platform.

## Installation

Ensure you have Docker installed on your machine. The project is already dockerized, so you can start the server with the following command:

```bash
docker compose up
```

## Usage

The API offers an endpoint to retrieve the number of issues for a specific journal on the OJS platform. Below is a detailed breakdown of the endpoint and its parameters:

```
GET /stats/issues/timeline
```

### Query Parameters

| Parameter        	| Type   	| Description                                                                                                                                                        	| Default 	|
|------------------	|--------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------	|---------	|
| `context`          	| `string` 	| The journal's context, derived from the journal's URL. For example, if the journal URL is https://journals.openedition.org/index.php/revue/, the context is revue. 	| N/A     	|
| `dateStart`        	| `string` 	| The start date for the timeline in the format YYYY-MM-DD.                                                                                                          	| N/A     	|
| `dateEnd`         	| `string` 	| The end date for the timeline in the format YYYY-MM-DD.                                                                                                            	| N/A     	|
| `timelineInterval` 	| `string` 	| Time interval for the timeline, either daily (day) or monthly (month).                                                                                             	| `month`   	|
| `type` (optional)  	| `string` 	| Specify whether to retrieve views for the table of contents or downloads of the galley.                                                                            	| `files`   	|

### Response Structure

The response will be a JSON array containing issue statistics:
    
```json
   [
        {
            "date": "string",
            "label": "string",
            "value": 0
        }
    ]
```

### Example Request

Here’s an example request for the endpoint:

```https
GET /stats/issues/timeline?dateStart=2014-06-19&dateEnd=2024-06-19&timelineInterval=month&context=JOURNAL-NAME&type=files
```

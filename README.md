# Mapper
Application to make simple animations and arrange media.

## Images
Images are available at /media/`:id`.jpg

## Endpoints
### GET /users/group/`:group`
To get all users from a specific group.
#### Example
request:

`get` `/users/group/4`

response:

```json
{
	"status": 200,
	"error": null,
	"users": [{
		"id": "272dcd30dd68beb47d42376605d9b8fe",
		"name": "Bram Bogaerts"
	}, {
		"id": "272dcd30dd68beb47d42376605d9b8fe",
		"name": "Thomas Boland"
	}]
}

```
### GET /users/`:id`
To get data associated with a specific user.
#### Example
request:

`get` `/users/272dcd30dd68beb47d42376605d9b8fe`

response:

```json
{
	"status": 200,
	"error": null,
	"user": {
		"id": "272dcd30dd68beb47d42376605d9b8fe",
		"group": 4,
		"name": "Bram Bogaerts",
		"objects": [{
			"number": 0,
			"nodes": [{
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 0,
				"x": 0,
				"y": 1
			}, {
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 1,
				"x": 0.5,
				"y": 0.5
			}, {
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 2,
				"x": 1,
				"y": 0.5
			}]
		}, {
			"number": 1,
			"nodes": [{
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 0,
				"x": 0,
				"y": 1
			}, {
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 1,
				"x": 0.5,
				"y": 0.5
			}, {
				"id": "272dcd30dd68beb47d42376605d9b8fe",
				"number": 2,
				"x": 1,
				"y": 0.5
			}]
		}],
		"keyframes": [{
			"position": 0,
			"activeNodes": [
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe"
			]
		}, {
			"position": 0.5,
			"activeNodes": [
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe"
			]
		}, {
			"position": 1,
			"activeNodes": [
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe",
				"272dcd30dd68beb47d42376605d9b8fe"
			]
		}]
	}
}
```

### POST /users/`:id`
To save keyframes associated with a specific user. Use `application/json` as the Content-Type header.
#### Example
request:

`post` `/users/272dcd30dd68beb47d42376605d9b8fe`

```json
{
	"user": "272dcd30dd68beb47d42376605d9b8fe",
	"keyframes": [{
		"position": 0,
		"activeNodes": [
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe"
		]
	}, {
		"position": 0.5,
		"activeNodes": [
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe"
		]
	}, {
		"position": 1,
		"activeNodes": [
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe",
			"272dcd30dd68beb47d42376605d9b8fe"
		]
	}]
}
```
response:

```json
{
	"status": 200,
	"error": null
}
```

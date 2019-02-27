'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE;

// const IS_OFFLINE = process.env.IS_OFFLINE;
// let dynamoDb;
// if (IS_OFFLINE === 'true') {
//   dynamoDb = new AWS.DynamoDB.DocumentClient({
//     region: 'localhost',
//     endpoint: 'http://localhost:8000'
//   })
//   console.log(dynamoDb);
// } else {
//   dynamoDb = new AWS.DynamoDB.DocumentClient();
// };



module.exports.hello = (event, context, callback) => {
	const response = {
      statusCode: 200,
      body: "Hello!!!!"
    }

  	callback(null, response)
    return

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.addUser = (event, context, callback) => {
	const data = JSON.parse(event.body);

	if (typeof data.userId !== 'string') {
	    console.error('Validation Failed')
	    callback(new Error('Couldn\'t add user'))
	    return
	} else if (typeof data.name !== 'string') {
		console.error('Validation Failed')
	    callback(new Error('Couldn\'t add user.'))
	    return
	}
	
	
	const params = {
	    TableName: USERS_TABLE,
	    Item: {
	      userId: data.userId,
	      name: data.name,
	    },
	  };


	dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t add user.'))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
    callback(null, response)
    return
  })
}

module.exports.getUser = (event, context, callback) => {

	console.log(event.queryStringParameters.userId);

	const params = {
	    TableName: USERS_TABLE,
	    Key: {
	      userId: event.queryStringParameters.userId,
	    },
	  }
	dynamoDb.get(params, (error, result) => {
		if (error) {
			callback(new Error("Coudn't get user"), null)
			return
		}

		const response = {
			statusCode: 200,
			body: JSON.stringify(result.Item)
		}
		callback(null, response)
		return
	})
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};



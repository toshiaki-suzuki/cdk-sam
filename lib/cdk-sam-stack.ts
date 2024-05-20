import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new cdk.aws_lambda.Function(this, 'HelloHandler', {
      functionName: 'CdkHelloWorld',
      runtime: cdk.aws_lambda.Runtime.PYTHON_3_12,
      code: cdk.aws_lambda.Code.fromAsset('lambda/hello-world'),
      handler: 'app.handler',
    });

    // Define the API Gateway resource
    const api = new LambdaRestApi(this, 'HelloWorldApi', {
      handler: lambda,
      proxy: false,
    });

    // Define the '/hello' resource with a GET method
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET');

    // stepfunctions
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: new sfn.Pass(this, 'Hello', {
        result: sfn.Result.fromObject({ hello: 'world' }),
      }),
    });
  }
}

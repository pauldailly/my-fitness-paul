const CloudWatch = require('aws-sdk/clients/cloudwatch');
const AWS_REGION = process.env.AWS_METRIC_REGION || 'eu-west-1';
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
const NAMESPACE = 'MyFitnessPaul';

const cloudWatch = new CloudWatch({
  apiVersion: '2010-08-01',
  region: AWS_REGION,
  logger: console
});


exports.publishMetric = (name, value, unit) => {
  const params = {
    MetricData: [
      {
        MetricName: name,
        Dimensions: [
          {
            Name: 'Env',
            Value: ENVIRONMENT
          },
          {
            Name: 'SearchTerm',
            Value: value
          }
        ],
        Timestamp: new Date().toISOString(),
        Unit: unit || 'None',
        Value: 1
      }
    ],
    Namespace: NAMESPACE
  };

  const p = new Promise((resolve, reject) => {

    cloudWatch.putMetricData(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });

  return p
    .catch((err) => {
      console.log(`Error publishing metric ${name} ${value}: ${JSON.stringify(err)}`);
    });
};

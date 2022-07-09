import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const App = () => {
  return (
    <div className="wrapper">
      <h1>Hello Webpack</h1>
      <div className="img-wrapper">
        <img src={require('@/images/logo')} alt="" />
      </div>
    </div>
  );
};

export default () => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Learn Webpack</title>
  <link rel="icon" href=${require('@/images/logo')} type="image/svg+xml">
</head>
<body>
  ${renderToStaticMarkup(<App />)}
</body>
</html>
`;

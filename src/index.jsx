import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Slide } from '@/components/slide';

const slideNameList = [
  'Webpack',
  'Pug',
  'JSX',
  'PostCSS',
  'Sass',
  'TypeScript',
];

const App = () => {
  return (
    <>
      {slideNameList.map((slideName) => (
        <Slide key={slideName} name={slideName} />
      ))}
    </>
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
  <link rel="icon" href=${require('@/images/webpack')} type="image/svg+xml">
</head>
<body>
  ${renderToStaticMarkup(<App />)}
</body>
</html>
`;

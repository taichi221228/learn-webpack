import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Card } from "@/components/hello";

const cardNameList = ["Webpack", "Pug", "PostCSS", "TypeScript"];

const App = () => {
  return (
    <>
      {cardNameList.map((cardName) => (
        <Card key={cardName} name={cardName} />
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
  <title>Webpack App</title>
  <link rel="icon" href=${require("@/images/webpack")} type="image/svg+xml">
</head>
<body>
  ${renderToStaticMarkup(<App />)}
</body>
</html>
`;

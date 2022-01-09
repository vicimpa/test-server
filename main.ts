import { Server } from "http";
import { parse } from "url";

import todos from "./todos.json";

const { length } = todos;

const server = new Server((req, res) => {
  const { pathname, query } = parse(req.url, true);
  const send = <T extends object>(e: T) => res.end(JSON.stringify(e, null, 2));
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname != '/api') {
    res.statusCode = 404;
    send({ error: 'Not found!' });
    return;
  }

  const { pageNumber = '1', pageSize = '4' } = query;

  const page = +pageNumber;
  const size = +pageSize;

  if (isNaN(page) || isNaN(size) || page < 1) {
    res.statusCode = 500;
    send({ error: 'Invalid params!' });
    return;
  }
  const d = (page - 1) * size;
  send({
    data: todos.slice(d, d + size), page: {
      current: page,
      first: 1,
      last: (length / size) | 0
    }
  });
});

server.listen(8080, () => console.log('Server start on 8080'));
import express from 'express';
import bodyParser from 'body-parser';
import { query, validationResult } from 'express-validator';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("Hello")
  } );
  
  app.get( "/filteredimage", query('image_url').notEmpty().isURL({protocols: ['http','https','ftp']}), async (req, res) => {
    const result = validationResult(req);

    // validate the image_url query
    if (result.errors.length > 0) {
      return res.status(400).send(`${result.errors[0].msg} on image_url.`);
    } 
    // call filterImageFromURL(image_url) to filter the image
    filterImageFromURL(req.query.image_url).then((resolve) => {
      // send the resulting file in the response
      return res.status(200).sendFile(resolve)
    }).catch((error) => {
      // send error in the response
      return res.status(500).send(`Internal server error: ${error}`)
    }).finally((resolve) => {
      if (resolve) {
        // deletes any files on the server on finish of the response
        deleteLocalFiles([resolve]);
      }
    });
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );

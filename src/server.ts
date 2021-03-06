import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const url = require('url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Supported image exttensions from https://www.npmjs.com/package/jimp
  const jimpSuportedList: string[] = ['jpg', 'png', 'bmp', 'tiff', 'gif'];

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
  app.get("/filteredimage/", async (req: Request, res: Response) => {
     let { image_url } = req.query;
     // Check if image_URL is not empty
     if(! image_url){
       return res.status(400).send("Missing image URL.");
     }

     // parse the URL using url parsing
     let parsedURL = url.parse(image_url, true);
     
     // Check the validity of the url 
     if(!parsedURL.protocol || !parsedURL.slashes || !parsedURL.hostname || !parsedURL.pathname){
       return res.status(400).send("Malformed URL.");

     }

     // Check if url image path extension is supported by jimp 
     if(jimpSuportedList.indexOf(parsedURL.pathname.split(".")[1]) === -1){
       return res.status(415).send("Image extension is not supported");
     }

     // Filter the image and send it in the responce and then delete it
     let filteredImageURI: string  = await filterImageFromURL(image_url);
     res.status(200).sendFile(filteredImageURI);
     res.on('finish', () => deleteLocalFiles([filteredImageURI]));
});

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
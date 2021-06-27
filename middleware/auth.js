import jwt from 'jsonwebtoken';

//request comes from frontend: first middleware is called to check autorizationa and then request is processed
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        let decodeddata = jwt.verify(token,'test');
        if(req.params.instructorID != decodeddata?.id)
            return res.status(400).json({"message":"User Not Authorized"});

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;
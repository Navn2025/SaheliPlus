var ImageKit=require("imagekit");

var imagekit=new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.URL_ENDPOINT
});
function uploadImage(file, fileName)
{
    return new Promise((resolve, reject) =>
    {
        imagekit.upload({
            file,
            folder: 'idProof',
            fileName
        }, function (error, result)
        {
            if (error)
            {
                return reject(error);
            }
            return resolve(result);
        });
    });
}
function uploadProfileImage(file, fileName)
{
    return new Promise((resolve, reject) =>
    {
        imagekit.upload({
            file,
            folder: 'profileImages',
            fileName
        }, function (error, result)
        {
            if (error)
            {
                return reject(error);
            }
            return resolve(result);
        });
    });
}
module.exports={uploadImage, uploadProfileImage};
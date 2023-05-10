const sajjad = (job, done) =>{
  try {    
    console.log({job});
    done();
  } catch (error) {
    console.log(error);
    // through karne se agli process ko add kr dega (error nahi aaiga )
    throw error;
  }
}
module.exports = sajjad;
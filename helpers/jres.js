const jsonResponse = (res, status, body) => {
    res.status(status);
    res.json(body);
};

module.exports.jsonResponse = jsonResponse;

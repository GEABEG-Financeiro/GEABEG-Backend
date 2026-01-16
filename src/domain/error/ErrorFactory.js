module.exports = (messageTuple) => {
    const [code, message] = messageTuple;
    return { code, message };
};
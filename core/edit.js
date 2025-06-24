// core/edit.js
module.exports = {
  editCommand(name, newData) {
    if (!global.commands.has(name)) return false;
    const command = global.commands.get(name);
    Object.assign(command, newData);
    global.commands.set(name, command);
    return true;
  }
};

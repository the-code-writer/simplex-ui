// fake-fsevents.js
export default () => ({
  watch: () => console.log("Mock fsevents"),
});

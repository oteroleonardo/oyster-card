# Development Best Practices

* **Twelve Factor** – Follow the Twelve Factor guide of software development
* **Package Management** – Yarn or NPM can be utilized for package management though we recommend using yarn. We also recommend saving exact package versions. This can be done by using a .yarnrc or .npmrc file.
* **Logging** – tslog should be used for logging. Do `NOT` use the console for logging 👀.
* **IDE** – Visual Studio Code is the recommended IDE for all NodeJS development though other IDEs like Atom or Emacs can also be used.
  * EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs
* **Documentation** – Start all projects with the proper documentation tools in place.
  * Utilize JSDoc for method, property, variable, and other code documentation
  * Utilize “Document This” add-on for Visual Studio code to help with creating code documentation
  * Utilize a library such as Documentation.js or jsdoc-to-markdown to extract all documentation to external HMTL or Markdown files.

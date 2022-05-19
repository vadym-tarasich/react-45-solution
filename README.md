# Bob's list admin page.

You may be already familiar with Bob. (If not - take a look at first react task). Maybe you've even helped him to organise his list. 

Long story short - he loves travelling, good food and making notes about his adventures.

So far Bob was saving his notes in one huge shared Excel file, which became very inconvenient for him.
That's why he decided to crate a proper admin for creating and editing notes.

Bob has progressed quite well in his React skills,
but he is heading off for another trip to Peru, so he won't be able to finish this project soon.

That's why he needs some help again :)

To make it easier for you, he did even hire some junior BA from the very real IT company to list all the requirements.

Here are the details and the AC:
 - The app contains of two main areas: the list and the add note form. Bob already took care of the layout and styling, but of course you can improve them. However, please do not change or remove the `data-test` attributes from the elements, as they help to test the application.
 - Make it possible to **add** and **remove** notes. (Bob will take care of editing later by himself. Or you can implement it if you want, it's **non-mandatory**)
 - Since Bob is a very curious person, he started studying spanish before the trip. To help himself a bit, he wants to make his app both in english and spanish languages.
    He did even start to create some translation engine for his app, but didn't know how to use React Context for that, so he only left some notes and translations sheet (as good as he could). All the details are in `lang/LangContext.tsx`
 - Bob did prepare some kind of network service to help you handle store, modify and retrieve data. It's called `NetworkHandler` and is stored in the file with the same name. P.S. So far it uses localStorage under the hood, but there is a plan to change it to proper back-end in the future.
    Bob has also prepared a React hook (`network/useRequest.ts`) to use this service. You should take a look there for details.
 - While any network request is pending, the app should display a loading screen, which covers whole UI and is rendered in a portal. (details in `LoadingOverlay.tsx`)
 - If the **update**/**add** request has failed, display the error above the save button in your form. Log **all** failures **to the console** via `console.log` with prefix `"Request failed: "`.
 - Use the same `NoteAddForm` for adding new notes
 - Bob would love his buttons make sounds **on click**. He did even prepare the sounds and the HOC to apply to his buttons, but didn't fishish it as usual. For details take a look at `sound/withSound.tsx`
 - There are a lot of defined interfaces and components over the app, but don't hesitate to improve those.
 - There is a set of tests that would help you to understand the desire behaviour of the app.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

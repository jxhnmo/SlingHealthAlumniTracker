import React, { useState } from "react";
import { useRouter } from "next/router";

const Documentation: React.FC = () => {
    return (
        <div>
            <h1>GUIDE</h1>
            <p>This guide will show the basic functionalities of this app</p>
            <h2>Basic functionalities</h2>
            <p>When a user comes to the app for the first time, they will be shown the login screen with a button they can click to log in. Once clicked, they will be prompted to sign in using a Google account for authentication. The chosen Google account will be bound to a unique profile and can be accessed in the future by simply logging in with that same Google account.</p>
            <p>Once logged in, the user will be shown their profile page by default. This profie page will contain information about the user.</p>\
            <p>The user can edit their own profile page by clicking on the edit button at the top right of the page.</p>
            <p>Here, the user can change aspects of their profile, such as their name, graduation year, major, profile picture, their achievements, teams, etc...</p>
            <p>To save, simply click the save button. THE CHANGES WILL NOT BE SAVED OTHERWISE.</p>
            <p>To see the other alumni, the user can click on the index tab. This will pull up a page that shows a list of users.</p>
            <p>To search for a specific user, the search bars at the top of the list can be used. Displayed users can be searched by name, achievemnts, and team by utilizing each respective search bar.</p>
            <p>To access a users profile, simply click on the user entry on the list. This will pull up the profile of that user.</p>
            <p>If the user wishes to access their own profile easily, there is a profile tab that will show the profile of the logged in user when clicked.</p>
            <p>To log out, simply click the logout tab.</p>
            <h2>Admin Priveleges</h2>
            <p>Admins (also referred to as faculty) have special permissions.</p>
            <p>Admins are able to edit the profile of any user to correct or remove inappropriate content.</p>
            <p>Admins can also designate other users as admin</p>
        </div>
    );
};

export default Documentation;
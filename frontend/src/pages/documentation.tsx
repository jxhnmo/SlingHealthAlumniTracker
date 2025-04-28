import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "react";

const Documentation: React.FC = () => {
  return (
    <div>
      <h1>GUIDE</h1>
      <p>This guide will show the basic functionalities of this app</p>
      <h2>Basic functionalities</h2>
      <p>
        When a user comes to the app for the first time, they will be shown the
        login screen with a button they can click to log in.
      </p>
      <img src="/loginPage.jpg" alt="login page" height="50%" width="50%"></img>
      <p>
        Once clicked, they will be prompted to sign in using a Google account
        for authentication. The chosen Google account will be bound to a unique
        profile and can be accessed in the future by simply logging in with that
        same Google account.
      </p>
      <img src="/googleSignIn.jpg" alt="google auth login page" height="50%" width="50%"></img>
      <p>
        Once logged in, the user will be shown their profile page by default.
        This profie page will contain information about the user.
      </p>
      <img src="/loginProfile.jpg" alt="profile page" height="50%" width="50%"></img>
      <p>
        The user can edit their own profile page by clicking on the edit button
        at the top right of the page.
      </p>
      <img
        src="/loginProfileEditBox.jpg"
        alt="profile page with edit button boxed" height="50%" width="50%"
      ></img>
      <p>
        Here, the user can change aspects of their profile, such as their name,
        graduation year, major, profile picture, their achievements, teams,
        etc...
      </p>
      <img src="/profileEdit.jpg" alt="profile edit page" height="50%" width="50%"></img>
      <img src="/profileEditScroll.jpg" alt="profile edit page" height="50%" width="50%"></img>
      <p>
        To save, simply click the save button. THE CHANGES WILL NOT BE SAVED
        OTHERWISE.
      </p>
      <img
        src="/profileEditSave.jpg"
        alt="profile edit page with save button boxed"
        height="50%" width="50%"
      ></img>
      <p>
        To see the other alumni, the user can click on the directory/index tab.
        This will pull up a page that shows a list of users.
      </p>
      <img src="/indexBoxed.jpg" alt="index tab boxed" height="50%" width="50%"></img>
      <p>
        To search for a specific user, the search bar at the top of the list can
        be used. Displayed users can be searched by name, achievemnts, and team
        by utilizing each respective search bar when the options button is
        clicked.
      </p>
      <img
        src="/directorySearchBar.jpg"
        alt="directory with search bar boxed"
        height="50%" width="50%"
      ></img>
      <img
        src="/directorySearchBarOptions.jpg"
        alt="directory search bar with more search bars"
        height="50%" width="50%"
      ></img>
      <p>
        To access a users profile, simply click on the user entry on the list.
        This will pull up the profile of that user.
      </p>
      <img src="/clickOnProfile.jpg" alt="click on a profile" height="50%" width="50%"></img>
      <p>
        If the user wishes to access their own profile easily, there is a
        profile tab that will show the profile of the logged in user when
        clicked.
      </p>
      <img src="/profileButton.jpg" alt="profile button boxed" height="50%" width="50%"></img>
      <p>To log out, simply click the logout tab.</p>
      <img src="/logoutButton.jpg" alt="logout button boxed" height="50%" width="50%"></img>
      <h2>Admin Priveleges</h2>
      <p>Admins (also referred to as faculty) have special permissions.</p>
      <p>
        Admins are able to edit the profile of any user to correct or remove
        inappropriate content.
      </p>
      <p>Admins can also designate other users as admin</p>
      <p>
        Want to give us feedback? Please fill out our survey:{" "}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfdymMiOCE6x1BusNKx02DiJlSQEltz72zfonIRWZwP-cE-FA/viewform?usp=dialog"
          target="_blank"
          className="text-purple-700"
        >
          Survey
        </a>
      </p>
    </div>
  );
};

export default Documentation;

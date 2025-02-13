"use client";

import React from "react";

const SignUpFrom = () => {
  return (
    <form action={(formData: FormData) => {}}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default SignUpFrom;

import { useState } from "react";
import NavBar from "../components/navbar";
import "./onboarding.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender: "",
    gender_preference: "",
    url: "",
    about: "",
    matches: [],
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:8000/user", {
        formData,
      });
      const success = response.status === 200;
      if (success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    console.log("e", e);
    const value =
      e.target.type === "checkbox" ? e.target.chcked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <NavBar setShowModal={() => {}} showModal={true} />

      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              required={true}
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="dob_day">Birthday</label>
            <div className="multiple-input">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />

              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />

              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>Gender</label>
            <div className="multiple-input">
              <input
                id="male-gender"
                type="radio"
                name="gender"
                value={"male"}
                onChange={handleChange}
                checked={formData.gender === "male"}
              />
              <label htmlFor="male-gender">Male</label>

              <input
                id="female-gender"
                type="radio"
                name="gender"
                value={"female"}
                onChange={handleChange}
                checked={formData.gender === "female"}
              />
              <label htmlFor="female-gender">Female</label>
            </div>

            <label htmlFor="show-gender">Show gender on my profile</label>
            <input
              id="show-gender"
              type="checkbox"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <label>Show Me</label>
            <div className="multiple-input">
              <input
                id="male-gender-preference"
                type="radio"
                name="gender_preference"
                value={"male"}
                onChange={handleChange}
                checked={formData.gender_preference === "male"}
              />
              <label htmlFor="male-gender-preference">Male</label>

              <input
                id="female-gender-preference"
                type="radio"
                name="gender_preference"
                value={"female"}
                onChange={handleChange}
                checked={formData.gender_preference === "female"}
              />
              <label htmlFor="female-gender-preference">Female</label>

              <input
                id="everyone-gender-preference"
                type="radio"
                name="gender_preference"
                value={"everyone"}
                onChange={handleChange}
                checked={formData.gender_preference === "everyone"}
              />
              <label htmlFor="everyone-gender-preference">Everyone</label>
            </div>

            <label htmlFor="about">About Me</label>
            <input
              id="about"
              type="text"
              name="about"
              required={false}
              placeholder="I like the beach and chicken tenders..."
              value={formData.about}
              onChange={handleChange}
            />
            <input type="submit" />
          </section>

          <section>
            <label htmlFor="about">Profile Photo</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              {formData.url && <img src={formData.url} alt="profile pic" />}
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Onboarding;

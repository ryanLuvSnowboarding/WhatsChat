import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs;

function Home(props) {
  const [posts, setPost] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keyword: "",
  });

  const handleSearch = (option) => {
    const { type, keyword } = option;
    setSearchOption({ type: type, keyword: keyword });
  };

  useEffect(() => {
    const { type, keyword } = searchOption;
    fetchPost(searchOption);
  }, [searchOption]);
  // a call-back function. whenever searchOption changed, it will render. The first time initalization, it will render.
  //didmount + didupdate
  const fetchPost = (option) => {
    const { type, keyword } = option;
    let url = "";

    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keyword}`; //query string
    } else {
      url = `${BASE_URL}/search?keywords=${keyword}`;
    }

    const opt = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
      // Bearer is the type of token
    };

    axios(opt) //similar to fetch, the opt is the configuration
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data);
        }
      })
      .catch((err) => {
        message.error("Fetch posts failed!");
        console.log("fetch posts failed: ", err.message);
      });
  };

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      return <div>No data!</div>;
    }
    if (type === "image") {
      const imageArr = posts //posts is data come back from back-end
        .filter((item) => item.type === "image") //call back function, only select image
        .map((image) => {
          return {
            //below are gallery fields
            postId: image.id,
            // postId is prepared for delete function, image.id will be referring to PhotoGallery
            src: image.url,
            user: image.user,
            caption: image.message,
            thumbnail: image.url,
            thumbnailWidth: 300,
            thumbnailHeight: 200,
          };
        });
      return <PhotoGallery images={imageArr} />;
    } else if (type === "video") {
      return (
        <Row gutter={32}>
          {posts
            .filter((post) => post.type === "video")
            .map((post) => (
              <Col span={8} key={post.url}>
                <video
                  src={PopStateEvent.url}
                  controls={true}
                  className="video-block"
                />
                <p>
                  {post.user}: {post.message}
                </p>
              </Col>
            ))}
        </Row>
      );
    }
  };

  const showPost = (type) => {
    setActiveTab(type);
    // highlighting one type in TopBar(photo or video)
    setTimeout(() => {
      setSearchOption({
        type: SEARCH_KEY.all,
        keyword: "",
      });
    }, 3000);
    // setTimeout takes two parameters, the first is function, the second is a number.
    // The purpose is executive function after 3 seconds
  };
  // call-back function
  const operations = <CreatePostButton onShowPost={showPost} />;
  // the above <CreatePostButton> is a component, not just a button
  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch} />
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="image"
          activeKey={activeTab}
          tabBarExtraContent={operations}
          // the placeHolder for upload button
        >
          <TabPane tab="Images" key="image">
            {renderPosts("image")}
          </TabPane>
          <TabPane tab="Videos" key="video">
            {renderPosts("video")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Home;

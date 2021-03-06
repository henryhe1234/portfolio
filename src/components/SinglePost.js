import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => {
  return builder.image(source);
};

export default function SinglePost() {
  const [singlePost, setSinglePost] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == "${slug}"]{
      title,
      _id,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      body,
      "name":author->name,
      "authorImage":author->image
    }`
      )
      .then((data) => {
        console.log(data);
        setSinglePost(data[0])})
      .catch(console.error);
  }, [slug]);
  if (!singlePost) return <div>Loading...</div>;
  return (
    <main className="bg-gray-200 min-h-screen p-12">
      <article className="container shadow-lg mx-auto bg-green-100 rounded-lg">
        <header classNmae="relative">
          
          <img
            src={singlePost.mainImage.asset.url}
            alt={singlePost.title}
            className="w-full object-cover rounded-t"
            style={{ height: "400px" }}
          />
        </header>
        <div className="px-16 lg:px-48 py-12 lg:py-20 prose lg:prose-xl max-w-full">
          <BlockContent
            blocks={singlePost.body}
            projectId="1f86nbch"
            dataset="production"
          />
        </div>
      </article>
    </main>
  );
}

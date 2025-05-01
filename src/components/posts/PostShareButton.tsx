import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { Post } from "@/services/socialService";
import {
  LinkedinShareButton,
  TwitterShareButton as XShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  XIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

interface PostShareButtonProps {
  post: Post;
}

export default function PostShareButton({ post }: PostShareButtonProps) {
  const [shareUrl, setShareUrl] = useState("");

  const handleShareClick = () => {
    // Generate the post URL
    const origin = window.location.origin;
    const url = `${origin}/${post.userDTO.username}/posts/${post.id}`;
    setShareUrl(url);
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const url = `${origin}/${post.userDTO.username}/posts/${post.id}`;

    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("Link copied to clipboard");
      },
      (err) => {
        toast.error("Failed to copy link");
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors rounded-full"
          onClick={handleShareClick}
          title="Share post"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/[0.05] focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 text-sm font-medium text-[#1D1D1F] border-b border-gray-100">
              Share via
            </div>
            <div className="p-3 grid grid-cols-4 gap-2">
              <XShareButton
                url={shareUrl}
                title={`Check out this post on Inbest:`}
              >
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <XIcon size={24} round />
                  </div>
                </div>
              </XShareButton>

              <LinkedinShareButton url={shareUrl}>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <LinkedinIcon size={24} round />
                  </div>
                </div>
              </LinkedinShareButton>

              <WhatsappShareButton url={shareUrl}>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <WhatsappIcon size={24} round />
                  </div>
                </div>
              </WhatsappShareButton>

              <TelegramShareButton url={shareUrl}>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <TelegramIcon size={24} round />
                  </div>
                </div>
              </TelegramShareButton>
            </div>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleCopyLink}
                  className={`${
                    active ? "bg-gray-50" : ""
                  } flex w-full items-center px-4 py-2 text-sm text-[#1D1D1F]`}
                >
                  <svg
                    className="mr-3 h-5 w-5 text-[#6E6E73]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy link
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

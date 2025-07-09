import React from "react";

import {
  ThumbsUpIcon,
  ChatCircleIcon,
  ShareFatIcon,
  EarthIcon,
} from "../../../../../../../assets/icons";
import { uniqueId } from "../../../../../../helpers";

const postContent =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
const avatar =
  "https://s3-alpha-sig.figma.com/img/47f0/e700/6edb8d39bef850ebd2251ece25fa6d8d?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SpwKKL8Ng6kRg0~BWPC~s091z15dI5dnHXVi0h6pkbZZFOtfUOWvfTO1WPKDD4HvxIKjZMmkJ3X1jszCx4XCxCaf9eAdeUwWUFPN8r1nB~AL4w7nTTgHqPRctUzbEpxGHYBBmjW6pmcXXcapuKmKzGwMWearVwIIhJsSK3MF0vHWDIT9c3U9M5kAlFITfUnsHQPu1jY1bErsxtIPs31-Yv2DohUl9zAWtnEK2YFI4FCkQC7WzztjsP8pl7CVkrJyjDcLDNVk9jtU5dkI2-swznxul9drLMDPIu0wulx5QsRdj0qTzWAdZw1ig5btTsObAnR5aG4w94WU1ilENFSy3w__";
const media =
  "https://s3-alpha-sig.figma.com/img/0f56/489c/f548fad9c83ab6e58e4189884c5d5490?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HufWeMcNH6ZKJSkLmmL5neU6nE92PBjtIDXj25El-dZXKE1bpDL~cE7Z8dIRnm8IOG3p8wVnBsn5ijVCpRBwJ4nZPP~5Ulsss055fklVbJGNFhsVQIiN7S81bZkFFVgeEA2BB0hljq9r7TgAtVTYyQPmQigEQQk1fYQ6zO1Vjb-r7hJ5d7b2RXyMBn-NCQwGs9AdCAwRG-Gsa4t6bQHnnpsBfnK-z9tCIky~3pSWya9f3ArftRBHYk~BMzecaBR0ZQDfRMqPRijuT-Vj~qhBsUvNqcIyhpKlwf43B8FG33O92y-GTgJNz3bOHKNJFx~pAL4xjdrDlrA0Jsb1toeI0Q__";

const footerIcons = [
  {
    id: uniqueId(),
    title: "Like",
    icon: <ThumbsUpIcon />,
  },
  {
    id: uniqueId(),
    title: "Comment",
    icon: <ChatCircleIcon />,
  },

  {
    id: uniqueId(),
    title: "Share",
    icon: <ShareFatIcon />,
  },
];

const FacebookPreviewCard = ({ styles }) => {
  return (
    <div className={styles.previewCardWrap}>
      <div className={styles.centeredWithGap}>
        <img src={avatar} alt="avatar" className={styles.avatar} />
        <div>
          <div className={`${styles.name} ${styles.facebookCardName}`}>
            John Doe
          </div>
          <div className={styles.centeredWithGap}>
            <div className={styles.createdDate}>9h ago</div>
            <div className={styles.separatorPoint} />
            <EarthIcon />
          </div>
        </div>
      </div>

      <div className={styles.postContent}>{postContent}</div>
      <img src={media} alt="post-img" className={styles.postImg} />
      <div className={styles.divider} />
      <div className={styles.centeredSpaceBetween}>
        {footerIcons.map((item) => {
          const { title, icon, id } = item;
          return (
            <div className={styles.iconWrap} key={id}>
              {icon}
              {title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacebookPreviewCard;

import { Review } from 'src/review/entities/review.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { UserUpvoteTag } from 'src/course/entities/user-upvote';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Review, (review) => review.author)
  authoredReviews: Review[];

  @ManyToMany(() => Review, (review) => review.upvoteUser)
  upvotedReviews: Review[];

  @ManyToMany(() => Review, (review) => review.downvoteUser)
  downvotedReviews: Review[];

  @OneToMany(() => Comment, (comment) => comment.author)
  authoredComments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.upvoteUser)
  upvotedComments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.downvoteUser)
  downvotedComments: Comment[];

  @OneToMany(() => UserUpvoteTag, (userUpvote) => userUpvote.user)
  upvotes: UserUpvoteTag[];
}

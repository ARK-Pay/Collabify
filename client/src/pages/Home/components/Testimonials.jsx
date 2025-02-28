import React from 'react';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';

const TestimonialsContainer = styled.div`
  background-color:#08143a;
  padding: 60px 20px;
  text-align: center;
  border-top: 5px solid #5078E6;
`;

const Title = styled.h2`
  font-size: 36px;
  color: #fff;
  margin-bottom: 40px;
  font-weight: 700;
`;

const TestimonialsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
`;

const TestimonialCard = styled.div`
  background-color: #1C1E27; /* Dark background for the card */
  border-radius: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4); /* Enhance shadow for dark card */
  padding: 30px;
  width: 350px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.6); /* Subtle hover shadow effect */
  }
`;

const TestimonialText = styled.p`
  font-size: 18px;
  line-height: 1.5;
  color: #fff;
  margin: 0 0 20px;
  font-style: italic;
`;

const TestimonialAuthor = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  color: #5078E6; /* Update to blue for better contrast */
  `;

const JobTitle = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #ccc;
`;

const RatingContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const TestimonialQuote = styled.span`
  font-size: 40px;
  color: #5078E6; /* Blue for quotes to align with theme */
  margin-right: 5px;
`;

const testimonialsData = [
  {
    id: 1,
    text: '“TeamSync is the ultimate tool for our projects! The intuitive design and real-time collaboration features have changed our workflow dramatically.”',
    author: 'John Doe',
    jobTitle: 'CEO, Tech Innovations',
    rating: 5,
  },
  {
    id: 2,
    text: '“Finally, a project management app that is user-friendly and efficient! TeamSync keeps our team organized and on track.”',
    author: 'Jane Smith',
    jobTitle: 'Marketing Manager, Creative Agency',
    rating: 4,
  },
  {
    id: 3,
    text: '“The integration of tasks, chats, and files in one place is brilliant! We’ve seen a significant increase in productivity since using TeamSync.”',
    author: 'David Lee',
    jobTitle: 'Software Engineer, CodeCraft',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <TestimonialsContainer id="testi">
      <Title>What Our Users Say</Title>
      <TestimonialsWrapper>
        {testimonialsData.map(testimonial => (
          <TestimonialCard key={testimonial.id}>
            <RatingContainer>
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <StarIcon key={index} style={{ color: '#FFC107' }} />
              ))}
            </RatingContainer>
            <TestimonialQuote>“</TestimonialQuote>
            <TestimonialText>{testimonial.text}</TestimonialText>
            <TestimonialQuote>”</TestimonialQuote>
            <TestimonialAuthor>
              {testimonial.author}, <JobTitle>{testimonial.jobTitle}</JobTitle>
            </TestimonialAuthor>
          </TestimonialCard>
        ))}
      </TestimonialsWrapper>
    </TestimonialsContainer>
  );
};

export default Testimonials;

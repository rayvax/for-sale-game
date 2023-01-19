import { FinalRating } from '../../../models/game';

interface FinalRatingTableProps {
  finalRatings: FinalRating[];
}

export function FinalRatingTable({ finalRatings }: FinalRatingTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nickname</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {finalRatings.map((rating, i) => (
          <tr key={`${rating.nickname}-${i}`}>
            <td>{rating.nickname}</td>
            <td>{rating.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import Skeleton from './Skeleton.jsx'

const sizeClasses = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-16',
}

function SkeletonAvatar({
  size = 'md',
  className = '',
}) {
  const selectedSize = sizeClasses[size] ?? sizeClasses.md

  return (
    <Skeleton
      radius="full"
      className={[selectedSize, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export default SkeletonAvatar

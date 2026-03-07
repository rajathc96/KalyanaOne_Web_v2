import Skeleton from "react-loading-skeleton";

function NewlyJoinedSkeleton() {
  return (
    <div className="content">
      <div className="tab-content-fade">
        <div className="profiles-grid" style={{ gap: "25px" }}>
          <div className="mobile-only">
            <Skeleton height={35} width={360} style={{ marginLeft: 8, borderRadius: 12 }} />
          </div>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div className="profile-card" key={idx}>
              <div className="profile-image-container" style={{ marginLeft: 8 }}>
                <div className="desktop-only">
                  <Skeleton height={380} width={330} style={{ borderRadius: 12 }} />
                </div>
                <div className="mobile-only">
                  <Skeleton height={380} width={355} style={{ borderRadius: 12 }} />
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-header">
                  <span className="profile-id">
                    <Skeleton width={60} height={18} />
                    <Skeleton width={18} height={18} circle style={{ marginLeft: 8 }} />
                  </span>
                  <Skeleton style={{ borderRadius: 12 }} width={60} height={22} />
                </div>
                <div className="profile-details">
                  <Skeleton width="80%" height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewlyJoinedSkeleton;
